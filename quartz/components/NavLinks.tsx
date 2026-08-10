import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/navlinks.scss"
import { classNames } from "../util/lang"

interface LinkItem {
  text: string
  href: string
}

interface Options {
  links: LinkItem[]
}

export default ((opts?: Options) => {
  const NavLinks: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? []
    if (links.length === 0) return null

    return (
      <nav class={classNames(displayClass, "nav-links")}>
        <ul>
          {links.map(({ text, href }) => {
            let slug = fileData.slug ?? ""
            if (slug === "index") slug = ""
            if (slug.endsWith("/index")) slug = slug.replace(/\/index$/, "")
            const normalized = href.replace(/^\/|\/$/g, "")
            const isActive = slug === normalized
            return (
              <li class={isActive ? "active" : ""}>
                <a href={href}>{text}</a>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  NavLinks.css = style
  return NavLinks
}) satisfies QuartzComponentConstructor
