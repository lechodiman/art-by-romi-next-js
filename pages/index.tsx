import { CustomLink } from '@/components/CustomLink';
import { TypographyH1 } from '@/components/TypographyH1';
import { SharedPageProps } from '@/pages/_app';
import { client, getSiteSettings } from '@/sanity/lib/client';
import { Painting, SiteSettings, featuredPaintingsQuery } from '@/sanity/lib/queries';
import { GetStaticProps } from 'next';
import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Differentiators from '@/components/Differentiators';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import AboutMe from '@/components/AboutMe';

interface PageProps extends SharedPageProps {
  siteSettings: SiteSettings;
  featuredPaintings: Painting[];
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const siteSettings = await getSiteSettings(client);
  const featuredPaintings = await client.fetch(featuredPaintingsQuery);

  return {
    props: {
      siteSettings,
      featuredPaintings,
    },
    revalidate: 3600,
  };
};

export default function Home(props: PageProps) {
  const { siteSettings, featuredPaintings } = props;

  return (
    <div>
      <Hero siteSettings={siteSettings} />
      <Gallery featuredPaintings={featuredPaintings} />
      <Differentiators />
      <Testimonials testimonials={siteSettings.testimonials} />
      <FAQ faqItems={siteSettings.faqItems} />
      <AboutMe aboutMe={siteSettings.aboutMe} />
    </div>
  );
}
