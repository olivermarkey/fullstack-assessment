import { AgGridReact } from "ag-grid-react";
import { type MaterialWithDetails } from "@fullstack-assessment/shared";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Material theme
import "./materials-table.css"; // Custom styles

// Register all modules
ModuleRegistry.registerModules([AllCommunityModule]);

type MaterialTableProps = {
    materials: MaterialWithDetails[];
}

export function MaterialsTable({ materials }: MaterialTableProps) {
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
      />
    </div>
  );
}