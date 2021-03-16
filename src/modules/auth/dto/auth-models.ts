import { UserPermissions } from "src/modules/user/entity/user";
import { AuthProvider } from "./auth-provider.enum";

export interface ExtraQueryParams {
    authuser: string;
}

export interface SessionState {
    extraQueryParams: ExtraQueryParams;
}

export interface GoogleAuthResponse {
    token_type: string;
    access_token: string;
    scope: string;
    login_hint: string;
    expires_in: number;
    id_token: string;
    session_state: SessionState;
    first_issued_at: number;
    expires_at: number;
    idpId: string;
}

export interface AuthJWT {
    userId: number,
    permissions: UserPermissions[],
    provider: AuthProvider,
}