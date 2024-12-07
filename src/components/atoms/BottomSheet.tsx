import React , {useState} from 'react';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';

// Define the types for the Bottom Sheet component
export type BottomSheetState = 'closed' | 'minimized' | 'expanded';

interface BottomSheetProps {
//   // State of the bottom sheet
//   sheetState: BottomSheetState;
//   // Function to update the state
//   setSheet: (state: BottomSheetState) => void;
  // Minimal content shown in the minimized state
  minimalContent: React.ReactNode;
  // Full content shown in the expanded state
  expandedContent: React.ReactNode;
  // Optional snap points (default to standard sizes)
  snapPoints?: (number | string)[];
  trigger?:any
}

export const BottomSheet: React.FC<BottomSheetProps> = ({

  minimalContent,
  expandedContent,
  trigger,
  snapPoints = ['148px', '355px', 1]
}) => {

    const [sheetState, setSheet] = useState<BottomSheetState>('closed');
  // Convert state to snap point
  const getSnapPoint = () => {
    switch (sheetState) {
      case 'closed': return null;
      case 'minimized': return snapPoints[0];
      case 'expanded': return snapPoints[2];
      default: return snapPoints[0];
    }
  };

  return (
    <Drawer.Root 
      snapPoints={snapPoints}
      activeSnapPoint={getSnapPoint()}
      setActiveSnapPoint={(point) => {
        if (point === null) setSheet('closed');
        else if (point === snapPoints[0]) setSheet('minimized');
        else setSheet('expanded');
      }}
      open={sheetState !== 'closed'}
      onOpenChange={(open) => {
        if (!open) setSheet('closed');
      }}
      modal={false}
    >
      <Drawer.Trigger asChild>
    {trigger}
      </Drawer.Trigger>

      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      
      <Drawer.Portal>
        <Drawer.Content 
          className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 max-h-[97%] mx-[-1px]"
        >
          {/* Header with Close and Expand buttons */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Bottom Sheet</h2>
            <div className="flex items-center space-x-2">
              {/* Expand Button */}
              <button 
                onClick={() => setSheet(sheetState === 'expanded' ? 'minimized' : 'expanded')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {sheetState === 'expanded' ? 'Minimize' : 'Expand'}
              </button>
              
              {/* Close Button */}
              <button 
                onClick={() => setSheet('closed')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div 
            className={`
              flex-grow overflow-y-auto p-4
              ${sheetState === 'expanded' ? 'h-full' : 'h-[200px]'}
            `}
          >
            {sheetState === 'minimized' ? minimalContent : expandedContent}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};