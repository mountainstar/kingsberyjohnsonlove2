#!/usr/bin/env python3
"""Reads monolithic styles.css, writes css/*.css modules + root styles.css with @import."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src_path = ROOT / "styles.css"
src = src_path.read_text()
if len(src.splitlines()) < 30 and "css/tokens.css" in src:
    raise SystemExit(
        "Refusing to run: styles.css is already the @import bundle. "
        "Restore the monolithic stylesheet, then run this script again."
    )
lines = src.splitlines(keepends=True)


def chunk(start: int, end: int) -> str:
    """1-based inclusive line numbers."""
    return "".join(lines[start - 1 : end])


def write(name: str, body: str) -> None:
    (ROOT / "css" / name).write_text(body.rstrip() + "\n")


(ROOT / "css").mkdir(exist_ok=True)
(ROOT / "scripts").mkdir(exist_ok=True)

write("tokens.css", "/* Design tokens */\n" + chunk(3, 51))
write("base.css", "/* Reset, page shell, skip link */\n" + chunk(53, 113))

app_bar = "/* Top app bar, drawer, scrim */\n" + chunk(115, 402)
app_bar += "\n@media (min-width: 640px) {\n" + chunk(974, 976) + "}\n"
app_bar += "\n@media (min-width: 900px) {\n" + chunk(991, 1089) + "}\n"
app_bar += "\n" + chunk(1313, 1324) + "\n"
write("app-bar.css", app_bar)

hero = "/* Full-viewport carousel hero */\n" + chunk(404, 659)
hero += "\n@media (min-width: 900px) {\n" + chunk(1091, 1107) + "}\n"
write("hero.css", hero)

about = "/* Home about + team teaser */\n" + chunk(661, 844)
about += "\n@media (min-width: 640px) {\n" + chunk(978, 986) + "}\n"
about += "\n@media (min-width: 900px) {\n" + chunk(1109, 1123) + "}\n"
write("about.css", about)

footer = "/* Site footer */\n" + chunk(846, 970).replace(
    'url("./assets/kingsbery-johnson/background.jpg")',
    'url("../assets/kingsbery-johnson/background.jpg")',
)
footer += "\n@media (min-width: 900px) {\n" + chunk(1125, 1141) + "}\n"
write("footer.css", footer)

write("practice-strip.css", "/* Home #practice strip */\n" + chunk(1144, 1196))
write("pages-inner.css", "/* Who we are, contact, team cards */\n" + chunk(1198, 1311))
write("pages-profile.css", "/* Attorney profile layout */\n" + chunk(1326, 1546))
write("reduced-motion.css", "/* prefers-reduced-motion */\n" + chunk(1548, 1569))

entry = """/* KJ&L — split stylesheets (edit files under css/) */
@import url("./css/tokens.css");
@import url("./css/base.css");
@import url("./css/app-bar.css");
@import url("./css/hero.css");
@import url("./css/about.css");
@import url("./css/footer.css");
@import url("./css/practice-strip.css");
@import url("./css/pages-inner.css");
@import url("./css/pages-profile.css");
@import url("./css/reduced-motion.css");
"""
(ROOT / "styles.css").write_text(entry)

print("Wrote css/*.css and root styles.css.")
