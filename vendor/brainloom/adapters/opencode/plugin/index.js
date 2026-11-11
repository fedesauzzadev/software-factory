// brainloom session notice — one-line kit update notice on the first prompt of
// each session, never blocking, offline-tolerant, opt-out per project.
//
// Bare plugin file: NO imports from opencode packages (a plain file under
// plugins/ cannot resolve them). Plain default export with id + setup(ctx).
import { brainWantsNotices, checkUpdate } from "./lib.js";

export default {
  id: "brainloom-notice",

  async setup(ctx) {
    const notified = new Set(); // one notice per session per server run

    await ctx.session.hook("prompt", async (event) => {
      if (notified.has(event.sessionID)) return;
      notified.add(event.sessionID);
      try {
        const s = await ctx.session.get({ sessionID: event.sessionID });
        // Session shape varies; resolve the project directory defensively and fail silent.
        const dir = s?.directory ?? s?.location?.directory ?? s?.project?.directory ?? null;
        if (!dir || !brainWantsNotices(dir)) return;
        const r = await checkUpdate();
        if (r?.update) {
          event.prompt.text +=
            `\n\n[brainloom] kit update available: ${r.line} Mention this to the user and suggest the kit-update skill (/kit-update).`;
        }
      } catch { /* notices never break sessions */ }
    });
  },
};
