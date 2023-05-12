import jwt from "jsonwebtoken";

export default function IsAuth(req: any, res: any, next: any) {
    const authHeader: string = req.get("Authorization");
    if(!authHeader){
        const error: any = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken: any;

    try {
        decodedToken = jwt.verify(token, "demirdogukan")
    } catch (error: any) {
        error.statusCode = 500;
        throw error;
    }

    if(!decodedToken){
        const error: any = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}
