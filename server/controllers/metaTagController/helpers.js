import path from 'path';

export const insertToHead = (indexFile, data) => {
  const [start, end] = indexFile.split('<head>')
  return start + '<head>' + data + end
} 

export const filePath = path.join(process.cwd(), 'client', 'build', 'index.html');

export const getMetaTagsString = (title, description, imageUrl) => {
  return (
    `<meta name="description" content="${description}" />` + 
    `<meta property="og:title" content="${title}" />` + 
    `<meta property="og:description" content="${description}" />` +
    `<meta property="og:image" content="${imageUrl}" />`
    )
}