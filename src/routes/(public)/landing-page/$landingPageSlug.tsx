import { getLandingPageBySlugServer } from '@/features/landing-pages/actions/server/getLandingPageBySlugServer';
import LandingPageWrapper from '@/features/landing-pages/components/LandingPageWrapper';
import { LandingPageProvider } from '@/features/landing-pages/contexts/LandingPageContext';
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/landing-page/$landingPageSlug')({
    component: RouteComponent,
    beforeLoad: async ({ context: { queryClient }, params }) => {
        const { landingPageSlug } = params;
        const landingPage = await queryClient.ensureQueryData({
            queryKey: ['landing-page', landingPageSlug],
            queryFn: () => getLandingPageBySlugServer({
                data: {
                    slug: landingPageSlug
                }
            })
        })
        if (!landingPage) {
            throw notFound();
        }
        return { landingPage }
    }
})

function RouteComponent() {
    const { landingPage } = Route.useRouteContext();
    return <LandingPageProvider landingPage={landingPage}>
        <LandingPageWrapper />
    </LandingPageProvider>
}
