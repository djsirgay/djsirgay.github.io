#!/usr/bin/env python3
"""Build the public, fact-checked DJ Sir Gay EPK and press release."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parent
FILES = ROOT / "files"
EPK = FILES / "DJ_Sir_Gay_EPK_2026.pdf"
RELEASE = FILES / "DJ_Sir_Gay_Press_Release_Belarus_in_Exile.pdf"
EMAIL = "ulyanoow@gmail.com"

NAVY = colors.HexColor("#060916")
PANEL = colors.HexColor("#12182b")
WHITE = colors.HexColor("#f7fbff")
MUTED = colors.HexColor("#aeb8cc")
CYAN = colors.HexColor("#35dcff")
PINK = colors.HexColor("#ff2f98")
RED = colors.HexColor("#ff405a")

FONT = "DJSGSans"
FONT_BOLD = "DJSGSans-Bold"
FONT_ITALIC = "DJSGSans-Oblique"
FONT_BOLD_ITALIC = "DJSGSans-BoldOblique"
pdfmetrics.registerFont(TTFont(FONT, "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont(FONT_BOLD, "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont(FONT_ITALIC, "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont(FONT_BOLD_ITALIC, "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily(
    FONT,
    normal=FONT,
    bold=FONT_BOLD,
    italic=FONT_ITALIC,
    boldItalic=FONT_BOLD_ITALIC,
)


def paragraph(c, text, x, y, width, size=10, leading=14, color=MUTED, bold=False):
    style = ParagraphStyle(
        "draw",
        fontName=FONT_BOLD if bold else FONT,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=TA_LEFT,
        spaceAfter=0,
    )
    p = Paragraph(text, style)
    _, height = p.wrap(width, 500)
    p.drawOn(c, x, y - height)
    return y - height


def label(c, text, x, y, color=CYAN):
    c.setFont(FONT_BOLD, 8.5)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())


def footer(c, page):
    c.setStrokeColor(colors.HexColor("#36405a"))
    c.line(42, 38, 570, 38)
    c.setFont(FONT_BOLD, 8)
    c.setFillColor(WHITE)
    c.drawString(42, 22, "DJ SIR GAY")
    c.setFont(FONT, 8)
    c.setFillColor(MUTED)
    c.drawString(104, 22, f"LOS ANGELES / {EMAIL} / DJSIRGAY.COM")
    c.drawRightString(570, 22, f"EPK / {page:02d}")


def stat(c, x, y, width, main, copy, accent):
    c.setFillColor(PANEL)
    c.roundRect(x, y, width, 64, 8, fill=1, stroke=0)
    c.setFillColor(accent)
    c.rect(x, y, 5, 64, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 16)
    c.drawString(x + 13, y + 37, main)
    paragraph(c, copy, x + 13, y + 28, width - 23, 7.4, 9, MUTED)


def epk_page_one(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, *LETTER, fill=1, stroke=0)
    c.setFillColor(PINK)
    c.rect(42, 746, 74, 5, fill=1, stroke=0)
    label(c, "Los Angeles / Queer / Belarusian artist in exile", 42, 724)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 42)
    c.drawString(42, 674, "DJ SIR GAY")
    c.setFillColor(PINK)
    c.setFont(FONT_BOLD, 17)
    c.drawString(42, 644, "FROM DICTATORSHIP TO THE DANCEFLOOR")
    paragraph(
        c,
        "Mashups, narrative DJ sets and pop memories rebuilt by a queer Belarusian artist in exile, based in Los Angeles.",
        42,
        610,
        515,
        13,
        18,
        WHITE,
    )

    stats_y = 496
    gap = 8
    width = (528 - gap * 3) / 4
    stat(c, 42, stats_y, width, "55", "Belarusian-language tracks", CYAN)
    stat(c, 42 + width + gap, stats_y, width, "2+ HOURS", "signature narrative set", PINK)
    stat(c, 42 + (width + gap) * 2, stats_y, width, "MARA / 2025", "Burning Man", RED)
    stat(c, 42 + (width + gap) * 3, stats_y, width, "LA-BASED", "Los Angeles", CYAN)

    label(c, "Signature performance", 42, 452)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 28)
    c.drawString(42, 418, "BELARUS IN EXILE")
    c.setFillColor(PINK)
    c.setFont(FONT_BOLD, 12)
    c.drawString(42, 397, "BURNING MAN 2025 / NARRATIVE DJ SET")
    y = paragraph(
        c,
        "A continuous two-hour journey through 55 Belarusian-language tracks. The set moves through homeland, pressure, rupture, escape, exile and release, carrying cultural memory toward the dancefloor.",
        42,
        370,
        515,
        12,
        17,
        MUTED,
    )

    c.setFillColor(PANEL)
    c.roundRect(42, 158, 528, 108, 9, fill=1, stroke=0)
    label(c, "Artist story", 58, 241)
    paragraph(
        c,
        "DJ Sir Gay is the project of Sergey Ulyanov. The name reclaims a childhood taunt and turns it into authorship, self-irony and a public language for freedom. His work connects queer visibility, Belarusian culture and global pop without genre borders.",
        58,
        222,
        496,
        10.5,
        15,
        WHITE,
    )

    c.setFont(FONT_BOLD, 9)
    c.setFillColor(CYAN)
    c.drawString(42, 121, "PLAY THE SIGNATURE SET")
    link = "https://youtu.be/5QEXd8XTPM0"
    c.setFont(FONT, 9)
    c.setFillColor(WHITE)
    c.drawString(42, 104, link)
    c.linkURL(link, (42, 98, 42 + stringWidth(link, FONT, 9), 114), relative=0)
    footer(c, 1)


def format_card(c, y, number, title, category, copy, accent):
    c.setFillColor(PANEL)
    c.roundRect(42, y, 528, 104, 10, fill=1, stroke=0)
    c.setFillColor(accent)
    c.roundRect(42, y, 7, 104, 4, fill=1, stroke=0)
    c.setFont(FONT_BOLD, 22)
    c.setFillColor(colors.HexColor("#33405b"))
    c.drawString(61, y + 70, number)
    c.setFont(FONT_BOLD, 15)
    c.setFillColor(WHITE)
    c.drawString(112, y + 72, title)
    label(c, category, 112, y + 54, accent)
    paragraph(c, copy, 112, y + 41, 432, 9, 12, MUTED)


def coverage_link(c, y, source, title, url, accent):
    c.setFillColor(accent)
    c.setFont(FONT_BOLD, 8)
    c.drawString(42, y, source.upper())
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 10)
    c.drawString(42, y - 17, title)
    c.linkURL(url, (42, y - 22, 570, y + 7), relative=0)


def epk_page_two(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, *LETTER, fill=1, stroke=0)
    label(c, "Booking file / 02", 42, 742, PINK)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 30)
    c.drawString(42, 700, "THREE WAYS INTO THE NIGHT")
    paragraph(c, "Set length, content and technical configuration are tailored and confirmed during advance.", 42, 678, 520, 10, 14, MUTED)

    format_card(c, 536, "01", "BELARUS IN EXILE", "Narrative / Cultural / Dance", "A Belarusian-language arc through memory, rupture, exile and release for festivals, arts programs and values-led stages.", CYAN)
    format_card(c, 416, "02", "QUEER FREQUENCY", "Pop / Disco / House / Mashups", "Queer classics, global pop and unexpected collisions adapted for clubs, outdoor stages, private events and community celebrations.", PINK)
    format_card(c, 296, "03", "EASTERN EUROPE REWIRED", "Eastern European Pop / Re-edits", "Regional pop memory rebuilt through mashups, edits and transitions for multilingual and diasporic audiences.", RED)

    label(c, "Selected independent coverage", 42, 260, PINK)
    coverage_link(c, 236, "Belarusian Council for Culture", "Belarusian Culture Review: DJ Sir Gay at Burning Man", "https://byculture.org/en/belarusian-culture-review-july-september-25/", CYAN)
    coverage_link(c, 194, "Human Rights First", "Never Lose Yourself: How Music Helped Sergey Reclaim His Future", "https://www.humanrightsfirst.org/library/never-lose-yourself-how-music-helped-sergey-reclaim-his-future", PINK)
    coverage_link(c, 152, "Unfiltered Stories", "Targeted in His Country for Being Gay", "https://www.youtube.com/watch?v=bTn2yMBUBG0", RED)

    c.setFillColor(PANEL)
    c.roundRect(42, 70, 528, 48, 8, fill=1, stroke=0)
    label(c, "Press / interviews / booking", 56, 98)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 13)
    c.drawString(56, 79, EMAIL)
    c.linkURL(f"mailto:{EMAIL}", (56, 74, 260, 91), relative=0)
    footer(c, 2)


def build_epk():
    c = canvas.Canvas(str(EPK), pagesize=LETTER)
    c.setTitle("DJ Sir Gay - Electronic Press Kit 2026")
    c.setAuthor("Sergey Ulyanov / DJ Sir Gay")
    epk_page_one(c)
    c.showPage()
    epk_page_two(c)
    c.save()


def build_release():
    styles = getSampleStyleSheet()
    title = ParagraphStyle("title", parent=styles["Title"], fontName=FONT_BOLD, fontSize=25, leading=29, textColor=colors.HexColor("#07101f"), alignment=TA_LEFT, spaceAfter=12)
    deck = ParagraphStyle("deck", parent=styles["BodyText"], fontName=FONT_BOLD, fontSize=13, leading=18, textColor=colors.HexColor("#30405d"), spaceAfter=18)
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], fontName=FONT_BOLD, fontSize=15, leading=19, textColor=colors.HexColor("#08182d"), spaceBefore=12, spaceAfter=7)
    body = ParagraphStyle("body", parent=styles["BodyText"], fontName=FONT, fontSize=10.5, leading=15.5, textColor=colors.HexColor("#162238"), spaceAfter=10)
    small = ParagraphStyle("small", parent=body, fontSize=8.7, leading=12, textColor=colors.HexColor("#526078"))
    link = ParagraphStyle("link", parent=body, fontName=FONT_BOLD, textColor=colors.HexColor("#006f8d"), spaceAfter=7)

    def on_page(c, doc):
        c.saveState()
        c.setFillColor(colors.HexColor("#07101f"))
        c.rect(0, 756, 612, 36, fill=1, stroke=0)
        c.setFillColor(CYAN)
        c.setFont(FONT_BOLD, 8)
        c.drawString(54, 770, "DJ SIR GAY / OFFICIAL PRESS MATERIAL")
        c.setFillColor(colors.HexColor("#6d7890"))
        c.setFont(FONT, 8)
        c.drawString(54, 27, f"DJSIRGAY.COM / {EMAIL}")
        c.drawRightString(558, 27, f"PRESS RELEASE / {doc.page:02d}")
        c.restoreState()

    doc = SimpleDocTemplate(str(RELEASE), pagesize=LETTER, leftMargin=54, rightMargin=54, topMargin=58, bottomMargin=46, title="DJ Sir Gay - Belarus in Exile Press Release", author="Sergey Ulyanov / DJ Sir Gay")
    story = [
        Paragraph("FOR IMMEDIATE RELEASE", ParagraphStyle("eyebrow", parent=small, fontName=FONT_BOLD, textColor=colors.HexColor("#d81978"), spaceAfter=10)),
        Paragraph("DJ Sir Gay presents <i>Belarus in Exile: From Dictatorship to the Dancefloor</i>", title),
        Paragraph("The two-hour narrative set brings together 55 Belarusian-language tracks and the experience of a queer Belarusian artist in exile.", deck),
        Paragraph("LOS ANGELES, CALIFORNIA - AUGUST 2026", small),
        Spacer(1, 8),
        Paragraph("Los Angeles-based artist DJ Sir Gay presents <i>Belarus in Exile - From Dictatorship to the Dancefloor</i>, a continuous two-hour DJ set built from 55 Belarusian-language tracks. Created for MARA at Burning Man 2025, the project carries Belarusian musical memory into a contemporary dancefloor narrative.", body),
        Paragraph("The signature set", h2),
        Paragraph("The set is structured as an emotional journey through homeland, pressure, rupture, escape, exile and release. Songs, edits, archival fragments and transitions are arranged as one continuous statement rather than a conventional playlist.", body),
        Paragraph("Belarusian language is the core material of the project. Familiar and lesser-known recordings are placed in a new rhythmic context while their cultural identity remains audible. The result is designed to work both as a cultural program and as a dancefloor experience.", body),
        Paragraph("The project was created for MARA at Burning Man in 2025. It is now available for festivals, arts and cultural programs, clubs, Pride events and private programming, with set length and content tailored during advance.", body),
        Paragraph("Project facts", h2),
        Table([
            [Paragraph("TITLE", small), Paragraph("Belarus in Exile - From Dictatorship to the Dancefloor", body)],
            [Paragraph("FORMAT", small), Paragraph("Continuous narrative DJ set", body)],
            [Paragraph("MUSIC", small), Paragraph("55 Belarusian-language tracks", body)],
            [Paragraph("LENGTH", small), Paragraph("Two-hour signature set; event format tailored by advance", body)],
            [Paragraph("CONTEXT", small), Paragraph("MARA / Burning Man 2025", body)],
        ], colWidths=[1.15 * inch, 5.7 * inch], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f4f8")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c9d1dd")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ])),
        PageBreak(),
        Paragraph("About DJ Sir Gay", h2),
        Paragraph("DJ Sir Gay is the Los Angeles-based project of Sergey Ulyanov, a queer Belarusian artist in exile. The name reclaims a childhood taunt and turns it into authorship, self-irony and a public language for freedom.", body),
        Paragraph("His work combines narrative DJ sets, global pop, queer classics and Eastern European musical memory. Alongside <i>Belarus in Exile</i>, his public project archive includes continuously updated mashups and long-form reworks of Eastern European pop catalogs.", body),
        Paragraph("Bookable programming", h2),
        Paragraph("<b>Belarus in Exile</b> - a Belarusian-language cultural and dance narrative for festivals, arts programs and values-led stages.", body),
        Paragraph("<b>Queer Frequency</b> - queer classics, global pop, disco, house and mashups adapted to the event.", body),
        Paragraph("<b>Eastern Europe Rewired</b> - Eastern European pop memory rebuilt through edits, mashups and transitions for multilingual and diasporic audiences.", body),
        Paragraph("Set length, content and technical configuration are flexible and confirmed during advance for each event.", body),
        Paragraph("Listen and verify", h2),
        Paragraph('<a href="https://youtu.be/5QEXd8XTPM0">Play Belarus in Exile on YouTube</a>', link),
        Paragraph('<a href="https://soundcloud.com/djsirgay">Open DJ Sir Gay on SoundCloud</a>', link),
        Paragraph('<a href="https://byculture.org/en/belarusian-culture-review-july-september-25/">Belarusian Council for Culture - Belarusian Culture Review</a>', link),
        Paragraph('<a href="https://www.humanrightsfirst.org/library/never-lose-yourself-how-music-helped-sergey-reclaim-his-future">Human Rights First - Never Lose Yourself</a>', link),
        Paragraph("Press, interviews and booking", h2),
        Paragraph(f'<a href="mailto:{EMAIL}">{EMAIL}</a>', ParagraphStyle("contact", parent=link, fontSize=15, leading=20, textColor=colors.HexColor("#d81978"))),
        Paragraph("DJ Sir Gay is based in Los Angeles, California. Full performance and technical advance is confirmed for each event.", body),
    ]
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


if __name__ == "__main__":
    FILES.mkdir(parents=True, exist_ok=True)
    build_epk()
    build_release()
    print(EPK)
    print(RELEASE)
