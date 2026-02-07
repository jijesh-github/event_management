from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.schemas import EventInput, EventCircular
from app.services.circular_service import generate_circular_service
from app.services.docx_generator import create_circular_docx
import os
import tempfile

router = APIRouter()

@router.post("/generate-circular")
async def generate_circular(input_data: EventInput):
    try:
        # Generate structured content using LLM
        circular = await generate_circular_service(input_data)
        
        # Create temporary file for the Word document
        temp_dir = tempfile.gettempdir()
        output_filename = "event_circular.docx"
        output_path = os.path.join(temp_dir, output_filename)
        
        # Generate Word document
        create_circular_docx(circular, output_path)
        
        # Return as downloadable file
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok"}
