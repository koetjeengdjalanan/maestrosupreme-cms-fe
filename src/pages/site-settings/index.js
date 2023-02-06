import {
  AdvantageInput,
  HeroInput,
  OfferingInput,
  ReviewInput,
} from '@/components/Input/SiteSettings';
import Loader from '@/components/Loader';
import { useMainContent, useUpdateMainContent } from '@/hooks/mainContent';
import { Accordion, AccordionTab } from 'primereact/accordion';

function SiteSettings() {
  const { data, isLoading } = useMainContent();
  const { mutateAsync: updateContent, isLoading: updating } =
    useUpdateMainContent();

  const handleUpdate = (newContent, { onSuccess, onError, onSettled }) => {
    try {
      updateContent(newContent, {
        onSuccess: () => {
          onSuccess && onSuccess();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Accordion activeIndex={0}>
      <AccordionTab header="Hero">
        <HeroInput data={data?.['1']} sectionId="1" onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Advantage-1">
        <AdvantageInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Advantage-2x">
        <AdvantageInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Offers">
        <OfferingInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Reviews">
        <ReviewInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
    </Accordion>
  );
}

export default SiteSettings;
