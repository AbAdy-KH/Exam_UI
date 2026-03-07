export function get_current_user_id()
{
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    const claimKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    ("Decoded JWT Payload:", json[claimKey]);    
    return json[claimKey] || null;
}