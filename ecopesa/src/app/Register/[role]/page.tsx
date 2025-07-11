// app/register/[role]/page.tsx
import { ROLES } from "@/utils/roles";
import SignUpForm from "@/components/auth/SignUpForm"

export default function RoleRegistrationPage({
  params,
}: {
  params: { role: string };
}) {
  const allowedRoles = [ROLES.RECYCLER, ROLES.COLLECTOR, ROLES.USER, ROLES.ADMIN];
  
  if (!allowedRoles.includes(params.role as typeof ROLES[keyof typeof ROLES])) {
    return <div>Invalid registration type</div>;
  }

  return (
    <div>
      <h1>Register as {params.role}</h1>
      <SignUpForm defaultRole={params.role as keyof typeof ROLES} />
    </div>
  );
}