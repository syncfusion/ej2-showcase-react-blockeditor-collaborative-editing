import React from "react";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";

interface ToggleOptionProps {
    panelMenuItems: any[];
    handlePanelToggle: (args: any) => void;
    panelDropdownRef: React.RefObject<DropDownButtonComponent | null>;
}

export const ToggleOption = React.memo(
    ({
        panelMenuItems,
        handlePanelToggle,
        panelDropdownRef,
    }: ToggleOptionProps): React.ReactElement => {

        return (
            <DropDownButtonComponent
                ref={panelDropdownRef}
                items={panelMenuItems}
                select={handlePanelToggle}
                cssClass="panel-toggle-dropdown e-caret-hide e-small"
                iconCss="e-icons e-more-vertical-2"
                title="Toggle panels"
                aria-label="Toggle panels"
            />
        );
    }
);