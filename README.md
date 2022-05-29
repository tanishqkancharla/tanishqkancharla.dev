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
`/pages`: Blog post pages which are either `.tk` (my personal blog post format) or `.tsx` files.

`/parser`: A parser for the `.tk` format, which uses the [teg](https://github.com/tanishqkancharla/teg) parser toolkit I built.

`/compiler`: A compiler that runs through the parsed contents of the blog post and does async-y things like load tweets, bookmarks, or syntax highlight code.

`/components`: Styled components for the website, including for each individual block in the blog posts.

`/styles`: Some basic styling variables for the website. Doesn't use css variables...yet.

`buildWebsite.ts`: Where everything gets read and built. `npm run build` only calls this file.

`config.ts`: Configuration for things I change most about my website: header image and accent color.

`PageContext.tsx/WebsiteContext.tsx`: React context providers that components can use while building.

---

Tanishq Kancharla
[https://tanishqkancharla.dev](https://tanishqkancharla.dev)
