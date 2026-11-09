import assert from "node:assert/strict";
import { createLocalReq, getPayload } from "payload";
import config from "../payload.config.ts";
import WORK from "../src/data/work.ts";
import EXPERIENCE from "../src/data/experience.ts";
import { PROFILE } from "../src/data/profile.ts";
import type { About, Project } from "../src/payload-types.ts";

assert.ok(
  process.argv.includes("--apply"),
  "Explicit --apply is required. Test on a backup branch before production.",
);

function lexical(paragraphs: string[]): About["introduction"] {
  return {
    root: {
      type: "root",
      version: 1,
      direction: null,
      format: "",
      indent: 0,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        version: 1,
        direction: null,
        format: "",
        indent: 0,
        children: [
          {
            type: "text",
            version: 1,
            text,
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
          },
        ],
      })),
    },
  };
}
function htmlText(value: string) {
  return lexical(
    value
      .split(/<\/p>/i)
      .map((part) =>
        part
          .replace(/<[^>]*>/g, "")
          .replace(/&amp;/g, "&")
          .trim(),
      )
      .filter(Boolean),
  );
}

async function main() {
  const payload = await getPayload({ config });
  const req = await createLocalReq({}, payload);
  try {
    const transactionID = await payload.db.beginTransaction();
    assert.ok(
      transactionID,
      "Database transactions must be available for an atomic portfolio update.",
    );
    req.transactionID = transactionID;
    try {
      const beforeMedia = await payload.count({
        collection: "media",
        req,
        overrideAccess: true,
      });
      const beforeGallery = await payload.count({
        collection: "gallery-items",
        req,
        overrideAccess: true,
      });
      const existing = await payload.find({
        collection: "projects",
        pagination: false,
        depth: 0,
        req,
        overrideAccess: true,
      });
      const bySlug = new Map(
        existing.docs.map((project) => [project.slug, project]),
      );
      const originalScreenshots = new Map(
        existing.docs.map((project) => [
          project.slug,
          JSON.stringify(project.screenshots),
        ]),
      );
      const about = await payload.findGlobal({
        slug: "about",
        depth: 0,
        req,
        overrideAccess: true,
      });
      const oldPortrait = about.portrait;

      await payload.updateGlobal({
        slug: "home",
        data: PROFILE.home,
        req,
        overrideAccess: true,
      });
      await payload.updateGlobal({
        slug: "site-settings",
        data: {
          seoTitle: "Gustam Rheza Mahendra | Software Engineer",
          seoDescription:
            "Jakarta-based software engineer with 4+ years in software engineering, building accessible web products and AI-powered solutions for government and enterprise teams.",
        },
        req,
        overrideAccess: true,
      });
      await payload.updateGlobal({
        slug: "about",
        data: {
          title: "Gustam Rheza Mahendra",
          introduction: lexical(PROFILE.introduction),
          exploringTitle: "Education",
          exploring: PROFILE.education,
          learningTitle: "Certifications & training",
          learning: PROFILE.certifications,
          interestsTitle: "Languages",
          interests: PROFILE.languages,
          favoritesTitle: "Technical skills",
          favorites: PROFILE.skills,
        },
        req,
        overrideAccess: true,
      });

      for (const [order, project] of WORK.entries()) {
        const prior = bySlug.get(project.slug);
        const data = {
          title: project.name,
          summary: project.summary,
          description: htmlText(project.description),
          order,
        };
        if (prior) {
          // Older project descriptions remain authoritative when the CV supplied no revision.
          const cvUpdated = [
            "news-app",
            "inventory-management-systems-app",
            "silamar",
            "evaluation-cat",
          ].includes(project.slug);
          await payload.update({
            collection: "projects",
            id: prior.id,
            data: cvUpdated ? data : { order },
            req,
            overrideAccess: true,
          });
        } else {
          assert.equal(
            project.images.length,
            0,
            `Restore existing project ${project.slug} and its media before updating.`,
          );
          await payload.create({
            collection: "projects",
            data: {
              ...data,
              slug: project.slug,
              displayDate: project.date,
              screenshots: [],
              externalURL: project.link || undefined,
              sourceKey: `legacy-project:${project.slug}`,
            },
            req,
            overrideAccess: true,
          });
        }
      }
      for (const [order, item] of EXPERIENCE.entries()) {
        const matches = await payload.find({
          collection: "experiences",
          where: { sourceKey: { equals: item.sourceKey } },
          limit: 2,
          req,
          overrideAccess: true,
        });
        assert.ok(
          matches.docs.length <= 1,
          `Duplicate experience key: ${item.sourceKey}`,
        );
        const data = {
          company: item.name,
          position: item.position,
          startDate: item.dates.start,
          endDate: item.dates.end,
          description: htmlText(item.description),
          order,
          sourceKey: item.sourceKey,
        };
        if (matches.docs[0])
          await payload.update({
            collection: "experiences",
            id: matches.docs[0].id,
            data,
            req,
            overrideAccess: true,
          });
        else
          await payload.create({
            collection: "experiences",
            data: { ...data, externalURL: item.link || undefined },
            req,
            overrideAccess: true,
          });
      }

      const after = await payload.find({
        collection: "projects",
        pagination: false,
        depth: 0,
        req,
        overrideAccess: true,
      });
      for (const project of existing.docs) {
        const preserved = after.docs.find(
          (item: Project) => item.id === project.id,
        );
        assert.equal(preserved?.slug, project.slug);
        assert.equal(
          JSON.stringify(preserved.screenshots),
          originalScreenshots.get(project.slug),
        );
      }
      assert.equal(
        (
          await payload.count({
            collection: "media",
            req,
            overrideAccess: true,
          })
        ).totalDocs,
        beforeMedia.totalDocs,
      );
      assert.equal(
        (
          await payload.count({
            collection: "gallery-items",
            req,
            overrideAccess: true,
          })
        ).totalDocs,
        beforeGallery.totalDocs,
      );
      assert.deepEqual(
        (
          await payload.findGlobal({
            slug: "about",
            depth: 0,
            req,
            overrideAccess: true,
          })
        ).portrait,
        oldPortrait,
      );
      const home = await payload.findGlobal({
        slug: "home",
        depth: 0,
        req,
        overrideAccess: true,
      });
      assert.equal(home.studyCaption, PROFILE.home.studyCaption);
      const experienceCount = await payload.count({
        collection: "experiences",
        req,
        overrideAccess: true,
      });
      assert.ok(after.docs.length >= WORK.length);
      assert.ok(experienceCount.totalDocs >= EXPERIENCE.length);
      await payload.db.commitTransaction(transactionID);
      console.log(
        `CV update committed: ${after.docs.length} projects, ${experienceCount.totalDocs} experiences; original URLs, screenshots, portrait, and gallery preserved.`,
      );
    } catch (error) {
      await payload.db.rollbackTransaction(req.transactionID!);
      throw error;
    }
  } finally {
    await payload.destroy();
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
