"use client"

import { useState, useCallback, useMemo } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { Button } from "./ui/button"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { chaseCenterSections } from "../lib/chase-center-sections"
import { ChaseCenterTooltip } from "./ChaseCenterTooltip"
import { SectionListingsPanel } from "./SectionListingsPanel"

interface ChaseCenterMapProps {
  listings: any[]
  onMessageOwner: (listing: any) => void
  currentUserId: string
}

export function ChaseCenterMap({ listings, onMessageOwner, currentUserId }: ChaseCenterMapProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Group listings by section
  const listingsBySection = useMemo(() => {
    return listings.reduce((acc, listing) => {
      const section = listing.haveSection
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(listing)
      return acc
    }, {} as Record<string, typeof listings>)
  }, [listings])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleSectionClick = useCallback((sectionNumber: string) => {
    setSelectedSection(sectionNumber)
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedSection(null)
  }, [])

  const getSectionColor = (sectionNumber: string) => {
    if (selectedSection === sectionNumber) return "#8b5cf6" // purple-500
    if (hoveredSection === sectionNumber) return "#a78bfa" // purple-400
    
    const count = listingsBySection[sectionNumber]?.length || 0
    if (count > 5) return "#10b981" // emerald-500
    if (count > 2) return "#34d399" // emerald-400
    if (count > 0) return "#6ee7b7" // emerald-300
    
    return "#e5e7eb" // gray-200
  }

  const hoveredSectionData = hoveredSection
    ? chaseCenterSections.find((s:{number:string}) => s.number === hoveredSection)
    : null

  const selectedSectionData = selectedSection
    ? chaseCenterSections.find((s:{number:string}) => s.number === selectedSection)
    : null

  return (
    <div className="relative h-[calc(100vh-12rem)]">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomIn()}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomOut()}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => resetTransform()}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 z-30 bg-background border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-semibold mb-2">Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span>5+ listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                  <span>3-5 listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-300 rounded"></div>
                  <span>1-2 listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>No listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full"
                onMouseMove={handleMouseMove}
              >
                {/* Background */}
                <rect x="0" y="0" width="800" height="600" fill="#fafafa" />

                {/* Court */}
                <rect
                  x="340"
                  y="280"
                  width="120"
                  height="70"
                  fill="#c2410c"
                  stroke="#7c2d12"
                  strokeWidth="3"
                  rx="4"
                />
                <text
                  x="400"
                  y="320"
                  textAnchor="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                >
                  COURT
                </text>

                {/* Render all sections */}
                {chaseCenterSections.map((section) => (
                  <g
                    key={section.id}
                    onMouseEnter={() => setHoveredSection(section.number)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSectionClick(section.number)}
                    style={{ cursor: 'pointer' }}
                  >
                    <path
                      d={section.path}
                      fill={getSectionColor(section.number)}
                      stroke="#1f2937"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />
                    <text
                      x={section.labelX}
                      y={section.labelY}
                      textAnchor="middle"
                      fill="#1f2937"
                      fontSize="10"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {section.number}
                    </text>
                    {listingsBySection[section.number]?.length > 0 && (
                      <text
                        x={section.labelX}
                        y={section.labelY + 10}
                        textAnchor="middle"
                        fill="#1f2937"
                        fontSize="8"
                        fontWeight="500"
                        pointerEvents="none"
                      >
                        ({listingsBySection[section.number].length})
                      </text>
                    )}
                  </g>
                ))}

                {/* Level Labels */}
                <text x="400" y="180" textAnchor="middle" fill="#6b7280" fontSize="14" fontWeight="600">
                  UPPER BOWL
                </text>
                <text x="400" y="450" textAnchor="middle" fill="#6b7280" fontSize="14" fontWeight="600">
                  LOWER BOWL
                </text>
              </svg>
            </TransformComponent>

            {/* Tooltip */}
            {hoveredSectionData && (
              <ChaseCenterTooltip
                section={hoveredSectionData.number}
                zone={hoveredSectionData.zone}
                listingCount={listingsBySection[hoveredSectionData.number]?.length || 0}
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
              />
            )}
          </>
        )}
      </TransformWrapper>

      {/* Side Panel */}
      {selectedSectionData && (
        <SectionListingsPanel
          section={selectedSectionData.number}
          zone={selectedSectionData.zone}
          listings={listingsBySection[selectedSectionData.number] || []}
          onClose={handleClosePanel}
          onMessageOwner={onMessageOwner}
          currentUserId={currentUserId}
        />
      )}
    </div>
  )
}