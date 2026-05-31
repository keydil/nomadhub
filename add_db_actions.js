const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/actions.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newFunctions = `
export async function deleteMenuItem(id: string) {
  const sb = await createServerSupabase();
  const { error } = await sb
    .from('menus')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

export async function editMenuItem(id: string, title: string, description: string, price: number, category: string) {
  const sb = await createServerSupabase();
  const { error } = await sb
    .from('menus')
    .update({
      title,
      description,
      price,
      category
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}
`;

// Insert the new functions after saveMenuItem
if (content.includes('export async function saveMenuItem')) {
  // Find the closing brace of saveMenuItem
  // It ends roughly around line 200:
  //   if (error) { ... }
  // }
  // Let's just append to the file before `export async function getVendorBySlug`
  content = content.replace('export async function getVendorBySlug', newFunctions + '\nexport async function getVendorBySlug');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('actions.ts updated');
} else {
  console.log('saveMenuItem not found');
}
