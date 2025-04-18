import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";

interface BreadCrumbItems {
  label: string;
  path: string;
}

export const BreakCrumbComponent: React.FC = () => {
  const location = useLocation();

  const generateBreadCrumbs = (): BreadCrumbItems[] => {
    const path = location.pathname.split("/").filter((item) => item);
    const breadCrumbs: BreadCrumbItems[] = [];

    let currentPath = "";

    path.forEach((segment) => {
      currentPath += `/${segment}`;
      breadCrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize the segment
        path: currentPath,
      });
    });

    return breadCrumbs;
  };

  const breadCrumbs = generateBreadCrumbs();

  return (
    <Breadcrumb className="flex items-center gap-2 py-4">
      {breadCrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
          <BreadcrumbItem>
            {index === breadCrumbs.length - 1 ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <Link to={crumb.path}>{crumb.label}</Link>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};
