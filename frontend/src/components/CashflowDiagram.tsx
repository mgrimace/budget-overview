import { ResponsiveSankey } from '@nivo/sankey';
import type { SankeyData } from '../types';

interface Props {
  data: SankeyData;
}

export default function CashflowDiagram({ data }: Props) {
  const textColor =
    getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() ||
    '#1e293b';

  return (
    <div className="sankey-container">
      <ResponsiveSankey
        data={data}
        margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
        align="justify"
        colors={{ scheme: 'category10' }}
        nodeOpacity={1}
        nodeHoverOpacity={1}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={3}
        linkOpacity={0.4}
        linkHoverOpacity={0.7}
        linkContract={3}
        enableLinkGradient
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={textColor}
      />
    </div>
  );
}
