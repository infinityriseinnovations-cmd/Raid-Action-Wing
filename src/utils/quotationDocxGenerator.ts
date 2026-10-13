import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer
} from 'docx';
import {
  QuotationDetails,
  INITIAL_QUOTATION_DATA,
  calculateQuotationTotals
} from '../data/quotationData';

const NAVY = '0F3889';
const DARK_NAVY = '0A192F';
const RED = 'D81820';
const SLATE_DARK = '1E293B';
const SLATE_MUTED = '475569';
const BORDER_COLOR = 'CBD5E1';
const BG_LIGHT = 'F8FAFC';
const BG_HEADER = '0F3889';
const BG_SUB = 'F1F5F9';

/**
 * Creates the complete docx Document instance representing the official quotation.
 */
export const createQuotationDocument = (
  data: QuotationDetails = INITIAL_QUOTATION_DATA,
  discountPercent = 10
): Document => {
  const totals = calculateQuotationTotals(data.modules, discountPercent);

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR }
  };

  const headerBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: '0A192F' },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D81820' },
    left: { style: BorderStyle.SINGLE, size: 1, color: '0A192F' },
    right: { style: BorderStyle.SINGLE, size: 1, color: '0A192F' }
  };

  // 1. Meta Details Table (Client & Vendor info)
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PREPARED FOR / CLIENT:', bold: true, size: 18, color: NAVY })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.clientOrganization, bold: true, size: 22, color: SLATE_DARK })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${data.clientName} (${data.clientDesignation})`, size: 18, color: SLATE_MUTED })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: data.clientRegistration, size: 16, color: SLATE_MUTED, italics: true })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'DOCUMENT REFERENCE & DATE:', bold: true, size: 18, color: NAVY })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Ref: ${data.quotationNumber}`, bold: true, size: 20, color: SLATE_DARK })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Issue Date: ${data.date}`, size: 18, color: SLATE_DARK })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Validity: ${data.validUntil}`, size: 18, color: RED, bold: true })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Prepared By: ${data.preparedBy}`, size: 16, color: SLATE_MUTED })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // 2. Financial Items Table
  const itemRows = data.modules.map((item, index) => {
    const isEven = index % 2 === 0;
    const bg = isEven ? 'FFFFFF' : BG_LIGHT;

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bg },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: item.id, bold: true, size: 18, color: NAVY })]
            })
          ]
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bg },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: item.name, bold: true, size: 19, color: SLATE_DARK })]
            }),
            new Paragraph({
              children: [new TextRun({ text: item.description, size: 16, color: SLATE_MUTED })]
            })
          ]
        }),
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bg },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: item.category, size: 16, color: SLATE_MUTED })]
            })
          ]
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bg },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `${item.estimatedHours} hrs`, size: 17, color: SLATE_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bg },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `₹${item.inrAmount.toLocaleString('en-IN')}`,
                  bold: true,
                  size: 19,
                  color: SLATE_DARK
                })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: `($${item.usdAmount.toLocaleString('en-US')})`,
                  size: 15,
                  color: SLATE_MUTED
                })
              ]
            })
          ]
        })
      ]
    });
  });

  const financialTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 140, bottom: 140, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Code', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Engineered Module & Deliverables', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 140, bottom: 140, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Subsystem', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 140, bottom: 140, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Hours', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Investment (INR / USD)', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          })
        ]
      }),
      // Item Rows
      ...itemRows,
      // Subtotal
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3,
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Gross Architectural Subtotal:', bold: true, size: 18, color: SLATE_DARK })]
              })
            ]
          }),
          new TableCell({
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${totals.totalHours} hrs`, bold: true, size: 18, color: SLATE_DARK })]
              })
            ]
          }),
          new TableCell({
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `₹${totals.subtotalInr.toLocaleString('en-IN')}`,
                    bold: true,
                    size: 19,
                    color: SLATE_DARK
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `($${totals.subtotalUsd.toLocaleString('en-US')})`,
                    size: 16,
                    color: SLATE_MUTED
                  })
                ]
              })
            ]
          })
        ]
      }),
      // Discount
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 4,
            borders: cellBorder,
            shading: { fill: 'ECFDF5' },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `Special Anti-Corruption Non-Profit Institutional Subsidy (${totals.discountPercent}%):`,
                    bold: true,
                    size: 18,
                    color: '065F46'
                  })
                ]
              })
            ]
          }),
          new TableCell({
            borders: cellBorder,
            shading: { fill: 'ECFDF5' },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `- ₹${totals.discountInr.toLocaleString('en-IN')}`,
                    bold: true,
                    size: 18,
                    color: '065F46'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `(- $${totals.discountUsd.toLocaleString('en-US')})`,
                    size: 15,
                    color: '065F46'
                  })
                ]
              })
            ]
          })
        ]
      }),
      // Net Total
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 4,
            borders: cellBorder,
            shading: { fill: NAVY },
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'NET PAYABLE PROJECT INVESTMENT (INCLUSIVE OF 1 YEAR SLA):',
                    bold: true,
                    size: 20,
                    color: 'FFFFFF'
                  })
                ]
              })
            ]
          }),
          new TableCell({
            borders: cellBorder,
            shading: { fill: NAVY },
            margins: { top: 140, bottom: 140, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `₹${totals.finalInr.toLocaleString('en-IN')}`,
                    bold: true,
                    size: 24,
                    color: 'FFEB3B'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `(US $${totals.finalUsd.toLocaleString('en-US')})`,
                    bold: true,
                    size: 18,
                    color: 'FFFFFF'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // 3. Detailed Scope Paragraphs
  const detailedScopeParagraphs = data.modules.flatMap((item) => [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 240, after: 60 },
      children: [
        new TextRun({ text: `${item.id}: ${item.name}`, bold: true, color: NAVY, size: 22 })
      ]
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: item.description, size: 19, color: SLATE_DARK })
      ]
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'Key Implemented Deliverables:', bold: true, size: 17, color: SLATE_MUTED })
      ]
    }),
    ...item.deliverables.map(
      (deliv) =>
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [new TextRun({ text: deliv, size: 18, color: SLATE_DARK })]
        })
    )
  ]);

  // 4. Milestones Table
  const milestoneTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Phase', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Milestone Title & Scope', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Timeline', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 120, bottom: 120, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Payment Split', bold: true, color: 'FFFFFF', size: 18 })]
              })
            ]
          })
        ]
      }),
      ...data.milestones.map((m, idx) => {
        const bg = idx % 2 === 0 ? 'FFFFFF' : BG_LIGHT;
        return new TableRow({
          children: [
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: m.phase, bold: true, size: 18, color: NAVY })] })]
            }),
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({ children: [new TextRun({ text: m.title, bold: true, size: 18, color: SLATE_DARK })] }),
                new Paragraph({ children: [new TextRun({ text: m.description, size: 16, color: SLATE_MUTED })] })
              ]
            }),
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: m.timeline, size: 18, color: SLATE_DARK })] })]
            }),
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `${m.percentage}% (₹${Math.round((totals.finalInr * m.percentage) / 100).toLocaleString('en-IN')})`, bold: true, size: 18, color: NAVY })]
                })
              ]
            })
          ]
        });
      })
    ]
  });

  // 5. Tech Stack Table
  const techRows = [
    { label: 'Frontend & UI Framework', items: data.techStack.frontend.join(' • ') },
    { label: 'Backend & APIs', items: data.techStack.backend.join(' • ') },
    { label: 'Database & Schemas', items: data.techStack.database.join(' • ') },
    { label: 'Document & Barcode Engines', items: data.techStack.documentsAndMedia.join(' • ') },
    { label: 'DevOps & Server Deployment', items: data.techStack.securityAndDevOps.join(' • ') }
  ];

  const techTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Layer / Component', bold: true, color: 'FFFFFF', size: 18 })] })
            ]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: headerBorder,
            shading: { fill: BG_HEADER },
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Enterprise Technologies Utilized', bold: true, color: 'FFFFFF', size: 18 })] })
            ]
          })
        ]
      }),
      ...techRows.map((t, idx) => {
        const bg = idx % 2 === 0 ? 'FFFFFF' : BG_LIGHT;
        return new TableRow({
          children: [
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t.label, bold: true, size: 18, color: SLATE_DARK })] })]
            }),
            new TableCell({
              borders: cellBorder,
              shading: { fill: bg },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: t.items, size: 18, color: NAVY, font: 'Courier New' })] })]
            })
          ]
        });
      })
    ]
  });

  // 6. Signature & Acceptance Block Table
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 140, bottom: 140, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'SUBMITTED ON BEHALF OF ENGINEERING TEAM:', bold: true, size: 16, color: SLATE_MUTED })]
              }),
              new Paragraph({
                spacing: { before: 200, after: 60 },
                children: [new TextRun({ text: 'Authorized Systems Lead', bold: true, size: 20, color: SLATE_DARK })]
              }),
              new Paragraph({
                children: [new TextRun({ text: data.preparedByCompany, size: 17, color: SLATE_DARK })]
              }),
              new Paragraph({
                children: [new TextRun({ text: `Date: ${data.date}`, size: 16, color: SLATE_MUTED })]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: BG_SUB },
            margins: { top: 140, bottom: 140, left: 160, right: 160 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'ACCEPTED & APPROVED ON BEHALF OF CLIENT:', bold: true, size: 16, color: SLATE_MUTED })]
              }),
              new Paragraph({
                spacing: { before: 200, after: 60 },
                children: [new TextRun({ text: 'Authorized Governing Signatory', bold: true, size: 20, color: NAVY })]
              }),
              new Paragraph({
                children: [new TextRun({ text: data.clientOrganization, size: 17, color: SLATE_DARK })]
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Official Command Seal / Date Stamp', size: 16, color: SLATE_MUTED, italics: true })]
              })
            ]
          })
        ]
      })
    ]
  });

  return new Document({
    title: `Commercial Quotation - ${data.projectTitle}`,
    description: `Official Commercial Proposal and Feature Quotation for ${data.clientOrganization}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000
            }
          }
        },
        children: [
          // Banner Top
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'RAID ACTION WING FOUNDATION (RAWF)',
                bold: true,
                size: 32,
                color: NAVY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'INTERNATIONAL ORGANISATION AGAINST CRIME & CORRUPTION',
                bold: true,
                size: 20,
                color: RED
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'COMMERCIAL PROPOSAL & TECHNICAL QUOTATION DOCUMENT',
                bold: true,
                size: 24,
                color: DARK_NAVY
              })
            ]
          }),

          // Metadata Table
          metaTable,

          new Paragraph({ spacing: { before: 240 } }),

          // Executive Summary Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '1. Executive Project Summary', bold: true, color: NAVY, size: 26 })
            ]
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: `This commercial quotation outlines the complete engineering, architectural design, security implementation, and dual-stack deployment for the official digital ecosystem of `,
                size: 19
              }),
              new TextRun({ text: data.clientOrganization, bold: true, size: 19 }),
              new TextRun({
                text: `. The system is engineered to institutional standards under the Indian Trusts Act 1882 (Registration IFA No. 760), providing citizen anti-corruption whistleblower channels, ISO CR80 accredited digital ID card issuance, public anti-fraud verification, 80G tax-exempt donation processing, and a high-command administrative console.`,
                size: 19
              })
            ]
          }),

          // Financial Summary Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: '2. Commercial Financial Breakdown & Scope Matrix', bold: true, color: NAVY, size: 26 })
            ]
          }),

          // Financial Table
          financialTable,

          new Paragraph({ spacing: { before: 240 } }),

          // Scope Details Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: '3. Detailed Feature Deliverables & Subsystem Specifications', bold: true, color: NAVY, size: 26 })
            ]
          }),

          ...detailedScopeParagraphs,

          new Paragraph({ spacing: { before: 240 } }),

          // Milestones Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: '4. Project Milestones & Deployment Schedule', bold: true, color: NAVY, size: 26 })
            ]
          }),

          milestoneTable,

          new Paragraph({ spacing: { before: 240 } }),

          // Technology Stack Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: '5. Technical Architecture & Security Stack', bold: true, color: NAVY, size: 26 })
            ]
          }),

          techTable,

          new Paragraph({ spacing: { before: 240 } }),

          // Terms Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: '6. Commercial Terms, Intellectual Property & Support SLA', bold: true, color: NAVY, size: 26 })
            ]
          }),

          ...data.terms.map(
            (term) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 80 },
                children: [new TextRun({ text: term, size: 18, color: SLATE_DARK })]
              })
          ),

          new Paragraph({ spacing: { before: 280, after: 120 } }),

          // Acceptance Heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: '7. Signatory Acceptance & Confirmation', bold: true, color: NAVY, size: 26 })
            ]
          }),

          signTable,

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 },
            children: [
              new TextRun({
                text: '— Confidential Commercial Document • Raid Action Wing Foundation • All Rights Reserved —',
                size: 15,
                color: SLATE_MUTED,
                italics: true
              })
            ]
          })
        ]
      }
    ]
  });
};

/**
 * Downloads the quotation as a .docx Word file directly in the browser
 */
export const downloadQuotationDocx = async (
  data: QuotationDetails = INITIAL_QUOTATION_DATA,
  discountPercent = 10,
  filename = 'Raid_Action_Wing_Website_Quotation.docx'
): Promise<void> => {
  const doc = createQuotationDocument(data, discountPercent);
  const blob = await Packer.toBlob(doc);

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
