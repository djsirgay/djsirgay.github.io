from pathlib import Path
from reportlab.lib.colors import Color, HexColor, black, white
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "press-kit/files/DJ_Sir_Gay_EPK_2026.pdf"
PHOTO = ROOT / "assets/dj-sir-gay-paint-v2.webp"
W, H = letter

TEAL = HexColor("#008080")
GRAY = HexColor("#c0c0c0")
NAVY = HexColor("#000080")
CYAN = HexColor("#5defff")
PINK = HexColor("#ff3a9d")
YELLOW = HexColor("#ffe45b")


def raised(c, x, y, w, h, fill=GRAY, line=1.5):
    c.setFillColor(fill)
    c.setStrokeColor(white)
    c.setLineWidth(line)
    c.rect(x, y, w, h, fill=1, stroke=1)
    c.setStrokeColor(HexColor("#333333"))
    c.line(x + w, y, x + w, y + h)
    c.line(x, y, x + w, y)


def window(c, x, y, w, h, title):
    raised(c, x, y, w, h)
    c.setFillColor(NAVY)
    c.rect(x + 4, y + h - 24, w - 8, 20, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 10, y + h - 18, title)
    for i, mark in enumerate(("_", "[]", "X")):
        bx = x + w - 61 + i * 18
        raised(c, bx, y + h - 22, 16, 16)
        c.setFillColor(black)
        c.setFont("Helvetica-Bold", 6)
        c.drawCentredString(bx + 8, y + h - 17, mark)
    return x + 8, y + 8, w - 16, h - 38


def text(c, value, x, y, width, font="Helvetica", size=10, leading=None, color=black, max_lines=None):
    leading = leading or size * 1.25
    words = value.split()
    lines, current = [], ""
    for word in words:
        candidate = word if not current else current + " " + word
        if stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    if max_lines:
        lines = lines[:max_lines]
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def button(c, label, x, y, w, url=None, primary=False):
    raised(c, x, y, w, 25, fill=GRAY)
    if primary:
        c.setStrokeColor(black)
        c.setDash(1, 1)
        c.rect(x + 4, y + 4, w - 8, 17, fill=0, stroke=1)
        c.setDash()
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + w / 2, y + 9, label)
    if url:
        c.linkURL(url, (x, y, x + w, y + 25), relative=0)


def page_bg(c, page_label):
    c.setFillColor(TEAL)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GRAY)
    c.rect(0, H - 32, W, 32, fill=1, stroke=0)
    raised(c, 4, H - 28, 86, 23)
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(13, H - 20, "DJ SIR GAY")
    raised(c, 96, H - 28, 210, 23, fill=white)
    c.setFont("Helvetica", 8)
    c.drawString(104, H - 20, page_label)
    c.setFillColor(HexColor("#005000"))
    c.circle(W - 77, H - 16, 3, fill=1, stroke=0)
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 7)
    c.drawRightString(W - 9, H - 19, "BOOKING ONLINE")


def build():
    c = canvas.Canvas(str(OUT), pagesize=letter, pageCompression=1)
    c.setTitle("DJ Sir Gay - Electronic Press Kit 2026")
    c.setAuthor("DJ Sir Gay / Sergey Ulyanov")

    page_bg(c, "WHY_THIS_EXISTS.TXT")
    x, y, w, h = window(c, 32, 36, 548, 710, r"C:\DJSG\PRESS\WHY_THIS_EXISTS.TXT")
    c.setFillColor(white)
    c.rect(x, y, w, h, fill=1, stroke=0)

    photo_w, photo_h = 202, 310
    px, py = x + w - photo_w - 12, y + h - photo_h - 16
    raised(c, px - 5, py - 22, photo_w + 10, photo_h + 46)
    c.drawImage(ImageReader(str(PHOTO)), px, py, photo_w, photo_h, preserveAspectRatio=True, anchor="c", mask="auto")
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(px, py - 13, "SERGEY.BMP - APPROVED PRESS IMAGE")

    tx = x + 18
    top = y + h - 42
    c.setFillColor(NAVY)
    c.setFont("Courier-Bold", 8)
    c.drawString(tx, top, "OPENED: WHY_THIS_EXISTS.TXT")
    top -= 43
    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 29)
    c.drawString(tx, top, "I WASN'T SUPPOSED")
    top -= 31
    c.drawString(tx, top, "TO BECOME A DJ.")
    top -= 39
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 25)
    c.drawString(tx, top, "I WAS SUPPOSED")
    top -= 27
    c.drawString(tx, top, "TO BECOME QUIET.")

    c.setFillColor(PINK)
    c.rect(tx, top - 104, 285, 88, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    yy = top - 39
    for line in ("A CHILDHOOD TAUNT BECAME A NAME.", "EXILE BECAME A SET.", "POP MEMORY BECAME A PLACE", "TO SURVIVE - THEN A DANCEFLOOR."):
        c.drawString(tx + 12, yy, line)
        yy -= 17

    body_y = top - 137
    body = ("DJ Sir Gay is the Los Angeles project of queer Belarusian artist Sergey Ulyanov: "
            "narrative sets, impossible pop collisions and Eastern European memory rebuilt loud enough "
            "to belong to him again. The name reclaims a childhood taunt and turns it into authorship, "
            "self-irony and a public language for freedom.")
    text(c, body, tx, body_y, 294, "Helvetica", 10, 14, black)

    c.setFillColor(NAVY)
    c.rect(tx, y + 84, w - 36, 70, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(tx + 14, y + 132, "FROM DICTATORSHIP TO THE DANCEFLOOR")
    c.setFillColor(white)
    c.setFont("Helvetica", 9)
    c.drawString(tx + 14, y + 115, "The biography is not decoration. It is why the music sounds like this.")
    c.setFillColor(YELLOW)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(tx + 14, y + 96, "LOS ANGELES / QUEER POP / BELARUSIAN MEMORY / NO GENRE BORDERS")
    button(c, "PLAY SIGNATURE SET", tx, y + 35, 145, "https://youtu.be/5QEXd8XTPM0", True)
    button(c, "DJSIRGAY.COM", tx + 154, y + 35, 120, "https://djsirgay.com")
    button(c, "BOOK / CONTACT", tx + 283, y + 35, 120, "mailto:ulyanoow@gmail.com")
    c.showPage()

    page_bg(c, "BOOKABLE_FEELINGS.M3U")
    x, y, w, h = window(c, 32, 36, 548, 710, "WINAMP - BOOKABLE FEELINGS.M3U")
    c.setFillColor(HexColor("#111111"))
    c.rect(x, y + h - 94, w, 94, fill=1, stroke=0)
    c.setFillColor(HexColor("#72ff72"))
    c.setFont("Courier-Bold", 9)
    c.drawString(x + 15, y + h - 26, "DON'T BOOK A GENRE. BOOK THE CHANGE IN THE ROOM.")
    c.setFont("Courier-Bold", 23)
    c.drawString(x + 15, y + h - 58, "THREE WAYS THE NIGHT CAN FEEL.")

    sets = [
        ("01", "BELARUS IN EXILE", "Memory -> pressure -> escape -> release", "A nation heard through Belarusian-language music. A two-hour narrative arc for cultural festivals, arts programs and rooms ready to listen before they dance."),
        ("02", "QUEER FREQUENCY", "Recognition -> nerve -> hands in the air", "Queer classics, global pop and shameless mashups. Not nostalgia: getting your history back with better transitions."),
        ("03", "EASTERN EUROPE REWIRED", "Home -> reinvention -> beautiful trouble", "SEREBRO, VIA Gra, t.A.T.u. and regional pop memory rebuilt for diaspora parties, queer rooms and audiences who know every word."),
    ]
    sy = y + h - 122
    for number, name, feeling, description in sets:
        c.setStrokeColor(HexColor("#888888"))
        c.line(x + 10, sy - 113, x + w - 10, sy - 113)
        c.setFillColor(HexColor("#b0b0b0"))
        c.setFont("Helvetica-Bold", 25)
        c.drawString(x + 15, sy - 15, number)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(x + 72, sy, feeling.upper())
        c.setFillColor(black)
        c.setFont("Helvetica-Bold", 21)
        c.drawString(x + 72, sy - 27, name)
        text(c, description, x + 72, sy - 48, w - 103, "Helvetica", 9, 12, black, 4)
        sy -= 125

    props_y = y + 137
    c.setFillColor(HexColor("#eeeeee"))
    c.rect(x + 10, props_y, w - 20, 61, fill=1, stroke=0)
    c.setStrokeColor(HexColor("#777777"))
    c.rect(x + 10, props_y, w - 20, 61, fill=0, stroke=1)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 20, props_y + 43, "FILE PROPERTIES")
    c.setFillColor(black)
    c.setFont("Helvetica", 8)
    c.drawString(x + 20, props_y + 27, "Los Angeles based  /  45-120 minutes  /  club  /  festival  /  cultural program")
    c.drawString(x + 20, props_y + 13, "Custom narrative available  /  Technical advance included  /  Full rider confirmed per event")

    c.setFillColor(NAVY)
    c.rect(x + 10, y + 20, w - 20, 98, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 27)
    c.drawString(x + 23, y + 79, "PUT ME IN THE ROOM.")
    c.setFillColor(YELLOW)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x + 24, y + 55, "ULYANOOW@GMAIL.COM")
    c.setFillColor(CYAN)
    c.setFont("Helvetica", 8)
    c.drawString(x + 24, y + 35, "DJSIRGAY.COM  /  INSTAGRAM @DJSIRGAY  /  SOUNDCLOUD /DJSIRGAY")
    c.linkURL("mailto:ulyanoow@gmail.com", (x + 20, y + 48, x + 240, y + 70), relative=0)
    c.save()


if __name__ == "__main__":
    build()
