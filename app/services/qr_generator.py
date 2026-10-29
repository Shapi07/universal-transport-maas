"""Digital QR Code Generator for Multimodal Single Journey Passes."""

import io
import base64
from typing import Optional


def generate_qr_code_image(data_payload: str, box_size: int = 8, border: int = 2) -> str:
    """Generates a QR code image as a base64-encoded PNG string.

    Args:
        data_payload: The text payload to encode into the QR code.
        box_size: Number of pixels per QR code module.
        border: Thickness of the quiet zone border.

    Returns:
        Base64 string representing PNG image ('data:image/png;base64,...').
    """
    try:
        import qrcode
        from PIL import Image

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=box_size,
            border=border,
        )
        qr.add_data(data_payload)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#1E3A8A", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        # Fallback dummy inline SVG if QR generation library fails
        encoded_text = data_payload[:40]
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">'
            f'<rect width="200" height="200" fill="#f1f5f9"/>'
            f'<text x="20" y="100" font-family="monospace" font-size="12" fill="#334155">{encoded_text}</text>'
            f'</svg>'
        )
        b64_svg = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
        return f"data:image/svg+xml;base64,{b64_svg}"


def generate_qr_bytes(data_payload: str) -> bytes:
    """Returns raw bytes of generated QR PNG image."""
    import qrcode

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data_payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
