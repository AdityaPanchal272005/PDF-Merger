import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('files');

  if (!files || files.length < 2) {
    return NextResponse.json({ error: 'Please upload at least two files.' }, { status: 400 });
  }

  try {
    // Create a new PDFDocument
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      // @ts-ignore
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return new NextResponse(Buffer.from(mergedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (err: any) {
    console.error('PDF merge error:', err);
    return NextResponse.json({ error: 'Failed to merge files. ' + (err?.message || '') }, { status: 500 });
  }
} 