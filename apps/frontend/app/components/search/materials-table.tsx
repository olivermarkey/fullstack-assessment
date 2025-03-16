import { AgGridReact } from "ag-grid-react";
import { type MaterialWithDetails } from "@fullstack-assessment/shared";
import { ModuleRegistry, AllCommunityModule, type ICellRendererParams } from 'ag-grid-community';
import { Menu, ActionIcon } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Material theme
import "./materials-table.css"; // Custom styles

// Register all modules
ModuleRegistry.registerModules([AllCommunityModule]);

type MaterialTableProps = {
    materials: MaterialWithDetails[];
    onEdit?: (material: MaterialWithDetails) => void;
    onDelete?: (material: MaterialWithDetails) => void;
}

// Custom cell renderer for the actions column
const ActionsRenderer = (props: ICellRendererParams) => {
    const material = props.data as MaterialWithDetails;
    
    return (
        <Menu position="bottom-end" withinPortal>
            <Menu.Target>
                <ActionIcon variant="subtle">
                    <IconDots size="1rem" />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconEdit size="1rem" />}
                    onClick={() => props.context.onEdit?.(material)}
                >
                    Edit
                </Menu.Item>
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash size="1rem" />}
                    onClick={() => props.context.onDelete?.(material)}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export function MaterialsTable({ materials, onEdit, onDelete }: MaterialTableProps) {
  const columnDefs = [
    { 
      headerName: "Material Number", 
      field: "material_number" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      width: 140,
      sort: "asc" as const
    },
    { 
      headerName: "Long Text", 
      field: "long_text" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1
    },
    { 
      headerName: "Description", 
      field: "description" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1
    },
    { 
      headerName: "Details", 
      field: "details" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1
    },
    { 
      headerName: "Noun", 
      field: "noun_name" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      width: 140
    },
    { 
      headerName: "Class", 
      field: "class_name" as keyof MaterialWithDetails,
      sortable: true,
      filter: true,
      resizable: true,
      width: 140
    },
    {
      headerName: "Actions",
      field: "id" as keyof MaterialWithDetails,
      sortable: false,
      filter: false,
      width: 100,
      cellRenderer: ActionsRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100
  };

  return (
    <div className="ag-theme-material">
      <AgGridReact
        rowData={materials}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        pagination={true}
        paginationAutoPageSize={true}
        suppressCellFocus={true}
        headerHeight={40}
        rowHeight={40}
        enableCellTextSelection={true}
        context={{ onEdit, onDelete }}
      />
    </div>
  );
}