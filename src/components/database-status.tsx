"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface DatabaseStatus {
  health: {
    status: string;
    database: string;
  };
  info: {
    type: string;
    url: string;
    isProduction: boolean;
  };
  timestamp: string;
}

export function DatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabaseStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDatabaseHealth();
      
      if (response.success && response.data) {
        setDbStatus(response.data);
      } else {
        setError(response.error || "Failed to fetch database status");
      }
    } catch (err) {
      setError("Failed to connect to database");
      console.error("Database status fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case "unhealthy":
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getDatabaseTypeBadge = (type: string) => {
    switch (type) {
      case "turso":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Turso</Badge>;
      case "local":
        return <Badge variant="outline">Local SQLite</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Memeriksa status database...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !dbStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Error: {error || "Unknown error"}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDatabaseStatus}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Status Database
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDatabaseStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status Koneksi</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(dbStatus.health.status)}
              {getStatusBadge(dbStatus.health.status)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tipe Database</span>
            {getDatabaseTypeBadge(dbStatus.info.type)}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Environment</span>
            <Badge variant={dbStatus.info.isProduction ? "default" : "secondary"}>
              {dbStatus.info.isProduction ? "Production" : "Development"}
            </Badge>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 mb-1">Database URL:</p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded">
              {dbStatus.info.url}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500">
              Terakhir diperiksa: {new Date(dbStatus.timestamp).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}