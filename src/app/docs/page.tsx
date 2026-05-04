import type { Metadata } from "next";
import { GraphqlReference } from "@/components/section/docs/graphql-reference";

export const metadata: Metadata = {
  title: "API Docs",
  description: "GraphQL reference for the BigCommerce storefront integration.",
};

export default function DocsPage() {
  return <GraphqlReference />;
}