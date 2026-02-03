"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
}