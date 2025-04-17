// src/auth/guards/role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt'; // Assuming you use @nestjs/jwt
import { Request } from 'express'; // Import Request type if using Express
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/users/entities/user.entity';

interface JwtPayload {
  sub: string; // Subject (usually user ID)
  email?: string;
  roles: Role[]; // *** Crucial: Assumes your JWT has a 'roles' claim containing an array of role strings/enums ***
  // Add other claims as needed (iat, exp, etc.)
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Method-level metadata
      context.getClass(), // Class-level metadata
    ]);

    // If no @Roles decorator is used, access is granted (or denied based on your default policy)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Or false if you want endpoints to require roles by default
    }

    // 2. Get the request object
    const request = context.switchToHttp().getRequest<Request>(); // Specify Request type

    // 3. Extract the JWT from the Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }

    try {
      // 4. Verify and decode the JWT
      //    Use verifyAsync for proper validation (checks signature and expiration)
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET, // Use your actual secret key, ideally from env variables
        // Add other verification options if needed
      });

      // --- IMPORTANT ---
      // Ensure your JWT payload structure matches the JwtPayload interface,
      // specifically the 'roles' claim. Adjust if your claim name is different
      // (e.g., 'realm_access.roles' for Keycloak, 'permissions', etc.).
      if (!payload.roles || !Array.isArray(payload.roles)) {
        console.error("JWT payload missing 'roles' array claim.");
        throw new ForbiddenException('Invalid token payload: missing roles');
      }

      // 5. Check if the user's roles include at least one of the required roles
      const userRoles: Role[] = payload.roles;
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `Access denied. Required roles: ${requiredRoles.join(', ')}`,
        );
      }

      // 6. Access granted
      // Optional: Attach user payload to request for later use in the handler
      // (This is often done in a preceding AuthGuard, but can be done here too)
      // request['user'] = payload; // Be mindful of overriding if using a separate AuthGuard

      return true;
    } catch (error) {
      // Handle specific JWT errors (expired, invalid signature)
      if (error instanceof ForbiddenException) {
        throw error; // Re-throw specific forbidden error
      }
      // Map JWT errors (like TokenExpiredError, JsonWebTokenError) to UnauthorizedException
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Helper function to extract token from 'Bearer <token>' format
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
