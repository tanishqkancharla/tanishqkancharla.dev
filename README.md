# Moonrise
My personal website, designed without a framework, and pretty much from scratch. Everything is pre-rendered (currently), and my blog uses a custom blog post format.

The setup is very similar to Next.js with the `/pages` directory corresponding to pages on the website. These can either be `.tk` or `.tsx` files (which can use `getStaticProps`).

## Running

```sh
npm run dev // Starts live-reload dev server
npm run build // Build blog
npm run serve // Serve built blog
```

## Source directories explained:
`/client`: Javascript for the client. At the moment its very very minimal.

`/pages`: Blog post pages which are either `.tk` (my personal blog post format) or `.tsx` files.

`/components`: Styled components for the website, including for each individual block in the blog posts.

`/styles`: Some basic styling variables for the website. Doesn't use css variables...yet.

`/server/buildWebsite.ts`: Where everything gets read and built. `npm run build` only calls this file.

`/server/parser`: A parser for the `.tk` format, which uses the [teg](https://github.com/tanishqkancharla/teg) parser toolkit I built.

`/server/compiler`: A compiler that runs through the parsed contents of the blog post and does async-y things like load tweets, bookmarks, or syntax highlight code.

`config.ts`: The website config that gets provided to pages when they render.

## The live-reload dev server

The dev server is passable. See `dev.ts` for how it works, but it basically builds the website, starts a web server, and watches source files for changes.

Unfortunately, at the moment, if a source file that's not one of the end-pages (i.e. `/src/pages/` or `/src/client/`) changes, it has to rebuild the website, since it doesn't know which files are dependent on it.

Eventually, I'd like to build something that will fix this, e.g. dependency graph parser. Either that, or cache the compilations of tk posts. But for now, everything is fairly fast.

## Things to do

- [ ] Projects page
- [ ] Statically load tweets

Header image
- [ ] Avoid layout shifts by measuring header image while building website.
- [ ] Use `sharp` to create header image at different sizes

Server effects
- [ ] useServerEffect, rerender while effects still exist
- [ ] Client side rendering framework...?

Server performance
- [ ] Cache network calls during a server run? Or cache parsed tk posts?
- [ ] Rebuliding whole website when source file that's not end-file changes is inefficient. Could have dependency checking.

Parser
- [ ] Move out into different project
- [ ] Use `testParser` for everything.

---

Tanishq Kancharla
[https://tanishqkancharla.dev](https://tanishqkancharla.dev)
