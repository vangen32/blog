import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./decoretors";
import { UserGlobalService } from "./user-global.service";
import ENV from "../../helpers/ENV";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector, private userService : UserGlobalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //console.log("auth guard");
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      //console.log("auth guard its public");
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      //console.log("No token");
      throw new UnauthorizedException();
    }
    try {
      const payload : {id :number, email : string} = await this.jwtService.verifyAsync(token, {
        secret : ENV.JwtSecret
      });
      const user = await this.userService.findUser(payload.id, payload.email);
      if(!user) {
        //console.log("No user");
        throw new UnauthorizedException();
      }
      request['user'] = user;
    } catch (e) {
      //console.error("Auth guard error", e)
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers["authorization"]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
