export interface Resource {
  id: string;
  type: string;
  ownerId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  owner?: { email: string };
  ownerEmail?: string;
}