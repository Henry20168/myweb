import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { type, brand, model } = await req.json();
    
    if (!type || !brand || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const seedFilePath = path.join(process.cwd(), 'prisma', 'seed.js');
    
    // Read the current seed file
    const seedContent = await fs.readFile(seedFilePath, 'utf-8');
    
    // Find the array of items (cars or motorcycles)
    const arrayStart = seedContent.indexOf(`const ${type}s = [`);
    if (arrayStart === -1) {
      return NextResponse.json({ error: 'Array not found' }, { status: 404 });
    }
    
    const arrayEnd = seedContent.indexOf('];', arrayStart);
    if (arrayEnd === -1) {
      return NextResponse.json({ error: 'Array end not found' }, { status: 404 });
    }
    
    // Extract the array content
    const beforeArray = seedContent.substring(0, arrayStart);
    const afterArray = seedContent.substring(arrayEnd + 2);
    const arrayContent = seedContent.substring(arrayStart, arrayEnd + 2);
    
    // Parse the array to find and remove the item
    const lines = arrayContent.split('\n');
    const filteredLines = [];
    let skipNext = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if we're in a multiline removal
      if (skipNext) {
        skipNext = false;
        continue;
      }
      
      // Check if this line contains the item to delete
      if (line.includes(`brand: '${brand}'`) && line.includes(`model: '${model}'`)) {
        // Skip this line and the next line (which is likely the comma or closing brace)
        skipNext = true;
        continue;
      }
      
      // Keep the line
      filteredLines.push(line);
    }
    
    // Reconstruct the content
    const newSeedContent = beforeArray + filteredLines.join('\n') + afterArray;
    
    // Write back to the file
    await fs.writeFile(seedFilePath, newSeedContent, 'utf-8');
    
    return NextResponse.json({ success: true, message: `${type} removed from seed data` });
    
  } catch (error) {
    console.error('Error updating seed file:', error);
    return NextResponse.json({ error: 'Failed to update seed file' }, { status: 500 });
  }
}
