from __future__ import annotations

from pathlib import Path
from zipfile import ZipFile

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
CV = ROOT / "public" / "cv"

ARTIFACTS = [
    {
        "stem": "Sebastian_Astroza_Software_Engineer_General_2026",
        "max_pages": 1,
        "required": [
            "SEBASTIÁN ANDRÉS ASTROZA AGUAYO",
            "PROFESSIONAL SUMMARY",
            "PROFESSIONAL EXPERIENCE",
            "Sep 2026–Present",
            "Aug 2025–Mar 2026",
            "TECHNICAL SKILLS",
            "SELECTED PROJECTS",
            "PostgreSQL/PostGIS",
            "CERTIFICATIONS",
            "LANGUAGES",
            "sebastroza10@gmail.com",
            "github.com/sebastroza1",
        ],
    },
    {
        "stem": "Sebastian_Astroza_CV_General_2026_ES",
        "max_pages": 2,
        "required": [
            "SEBASTIÁN ANDRÉS ASTROZA AGUAYO",
            "PERFIL PROFESIONAL",
            "EXPERIENCIA PROFESIONAL",
            "Sep 2026–Actualidad",
            "Ago 2025–Mar 2026",
            "HABILIDADES TÉCNICAS",
            "PROYECTOS SELECCIONADOS",
            "PostgreSQL/PostGIS",
            "CERTIFICACIONES",
            "IDIOMAS",
            "sebastroza10@gmail.com",
            "github.com/sebastroza1",
        ],
    },
]


def validate_docx(path: Path) -> None:
    with ZipFile(path) as archive:
        names = set(archive.namelist())
        document_xml = archive.read("word/document.xml").decode("utf-8")
        relationships = archive.read("word/_rels/document.xml.rels").decode("utf-8")
    assert "w:documentProtection" not in document_xml, f"{path.name}: document is protected"
    assert not any(name.startswith("word/media/") for name in names), f"{path.name}: unexpected embedded image"
    for address in ["mailto:sebastroza10@gmail.com", "https://github.com/sebastroza1", "https://sebastroza1.github.io"]:
        assert address in relationships, f"{path.name}: missing external hyperlink {address}"


def validate_pdf(path: Path, required: list[str], max_pages: int) -> None:
    reader = PdfReader(path)
    assert 1 <= len(reader.pages) <= max_pages, f"{path.name}: unexpected page count"
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    for value in required:
        assert value in text, f"{path.name}: extracted text missing {value!r}"
    annotations = []
    for page in reader.pages:
        for ref in page.get("/Annots", []):
            annotation = ref.get_object()
            action = annotation.get("/A")
            if action and action.get("/URI"):
                annotations.append(str(action["/URI"]))
    normalized_annotations = {value.rstrip("/") for value in annotations}
    for address in ["mailto:sebastroza10@gmail.com", "https://github.com/sebastroza1", "https://sebastroza1.github.io"]:
        assert address.rstrip("/") in normalized_annotations, f"{path.name}: missing clickable PDF link {address}"
    metadata = reader.metadata
    assert metadata and "Sebastián" in (metadata.title or ""), f"{path.name}: missing professional title metadata"
    assert "Astroza" in (metadata.author or ""), f"{path.name}: missing author metadata"


def main() -> None:
    for artifact in ARTIFACTS:
        docx = CV / f"{artifact['stem']}.docx"
        pdf = CV / f"{artifact['stem']}.pdf"
        assert docx.is_file() and docx.stat().st_size > 10_000, f"Missing DOCX: {docx}"
        assert pdf.is_file() and pdf.stat().st_size > 10_000, f"Missing PDF: {pdf}"
        validate_docx(docx)
        validate_pdf(pdf, artifact["required"], artifact["max_pages"])
        print(f"validated {docx.name} and {pdf.name}")


if __name__ == "__main__":
    main()
