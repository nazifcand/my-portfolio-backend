import * as multer from 'multer';
import * as path from 'path';
import slugify from 'slugify';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/');
  },

  filename: (req, file, cb) => {
    const fileName: string = slugify(path.parse(file.originalname).name, {
      lower: true,
    });
    cb(null, `${fileName}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
