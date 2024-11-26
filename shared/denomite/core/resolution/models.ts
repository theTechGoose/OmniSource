export interface BuiltDependency {
  id: string;
  template: Constructor;
  params: Array<Constructor>;
}

export type DependencyManifest = Record<string, BuiltDependency> 
