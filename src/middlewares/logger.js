 const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
   console.log(`${timestamp}- ${req.method}- ${req.url} from ${ip}`);
 next();
};

export default logRequest;