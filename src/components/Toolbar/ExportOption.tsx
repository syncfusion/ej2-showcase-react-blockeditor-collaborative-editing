import React from "react";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";

interface ExportOptionProps {
    exportMenuItems: any[];
    handleExport: (args: any) => void;
    exportDropdownRef: React.RefObject<DropDownButtonComponent | null>;
}

export const ExportOption = React.memo(
    ({
        exportMenuItems,
        handleExport,
        exportDropdownRef,
    }: ExportOptionProps): React.ReactElement => {

        return (
            <div className="toolbar-left">
                <DropDownButtonComponent
                    ref={exportDropdownRef}
                    items={exportMenuItems}
                    select={handleExport}
                    cssClass="export-button e-small"
                    iconCss="e-icons e-download"
                >
                    Export
                </DropDownButtonComponent>
            </div>
        );
    }
);