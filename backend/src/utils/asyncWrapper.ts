import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wrap an async express handler and forward errors to next()
 * Usage: router.get('/', asyncWrapper(async (req, res) => { ... }))
 */
const asyncWrapper = (fn: AsyncHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Ensure we catch both synchronous throw and rejected promise
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncWrapper;