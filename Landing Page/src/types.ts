/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DBEngine {
  SpringBoot = 'Spring Boot',
  PostgreSQL = 'PostgreSQL',
  MongoDB = 'MongoDB',
  Cassandra = 'Cassandra',
  Neo4j = 'Neo4j'
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  service: string;
  dbType: DBEngine;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: string;
  responseBody: string;
  statusCode: number;
}

export interface TeamMember {
  name: string;
  role: string;
  engine: DBEngine;
  color: string;
  details: string;
  avatarIcon: string;
}

export interface DictionaryItem {
  engine: DBEngine;
  title: string;
  subtitle: string;
  language: string;
  icon: string;
  description: string;
  codeBlocks: {
    filename: string;
    code: string;
    highlights: { text: string; color: string }[];
  }[];
}

export interface DemoStep {
  stepNumber: number;
  title: string;
  engine: DBEngine | 'Core SQL';
  actionLabel: string;
  apiRoute: string;
  logMessage: string;
  payloadDescription: string;
  codeOutput: string;
}
