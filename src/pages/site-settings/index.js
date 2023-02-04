import React from 'react';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { AdvantageInput, HeroInput } from '@/components/Input/SiteSettings';

function SiteSettings() {
    return (
        <Accordion activeIndex={0}>
            <AccordionTab header="Hero">
                <HeroInput />
            </AccordionTab>
            <AccordionTab header="Advantage-1">
                <AdvantageInput />
            </AccordionTab>
            <AccordionTab header="Advantage-2x">
                <p className="m-0">
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                    praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                    excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                    officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                    rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis
                    est eligendi optio cumque nihil impedit quo minus.
                </p>
            </AccordionTab>
        </Accordion>
    );
}

export default SiteSettings;
