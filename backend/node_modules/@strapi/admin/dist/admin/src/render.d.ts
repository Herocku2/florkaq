import { StrapiAppConstructorArgs } from './StrapiApp';
interface RenderAdminArgs {
    customisations: StrapiAppConstructorArgs['adminConfig'];
    plugins: StrapiAppConstructorArgs['appPlugins'];
}
declare const renderAdmin: (mountNode: HTMLElement | null, { plugins, customisations }: RenderAdminArgs) => Promise<void>;
export { renderAdmin };
export type { RenderAdminArgs };
