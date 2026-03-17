import React, { useEffect, useState } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import type { SankeyData } from '../types';

interface Props {
  data: SankeyData;
}

const SankeyTooltip = ({ link }: { link: any }) => (
  <div className="sankey-tooltip">
    <strong>{link.source.label} → {link.target.label}</strong>
    <div className="sankey-tooltip-value">${link.value.toLocaleString()}</div>
  </div>
);

const nivoTheme = {
  text: {
    fill: 'var(--color-text)',
    fontSize: 13,
  },
  tooltip: {
    container: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
  },
};

export default function BudgetDiagram({ data }: Props) {
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeKey(prev => prev + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sankey-container">
      <ResponsiveSankey
        key={themeKey}
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
        labelTextColor="var(--color-text)"
        linkTooltip={SankeyTooltip}
        theme={nivoTheme}
      />
    </div>
  );
}