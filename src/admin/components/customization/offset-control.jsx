

import { useState, Fragment, useContext } from "@wordpress/element";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { cn } from "../../../lib/utils";
import { Info } from "lucide-react";
import AccessiblyContext from "../../../context/accessibly-context";
import { Skeleton } from "../../../components/ui/skeleton";
export default function OffsetControls() {
   const { svgSettings, setSvgSettings, isLoading } = useContext(AccessiblyContext);
   const {  exactPosition } = svgSettings || {};
   const {enabled, horizontalOffset, verticalOffset, horizontalDirection, verticalDirection} = exactPosition || {};
   if(isLoading){
    return (
      <div className="zn:flex-1 zn:p-4 zn:border zn:border-gray-200 zn:rounded-md zn:bg-card">
      <div className="zn:flex zn:items-center zn:justify-between zn:mb-4">
        <div className="zn:flex zn:items-center zn:gap-2">
          <Skeleton className="zn:h-4 zn:w-[220px]" /> 
          <Info className="zn:size-4 zn:text-gray-400" />
        </div>
        <Skeleton className="zn:relative zn:inline-flex zn:h-6 zn:w-10 zn:rounded-full" />
       
      </div>
      <div className="zn:space-y-3">
        
        <div className="zn:flex zn:items-center zn:gap-2">
          <Skeleton className="zn:h-10 zn:w-20 zn:rounded-md" /> 
          <Skeleton className="zn:h-4 zn:w-6" /> 
          <Skeleton className="zn:flex-1 zn:h-10 zn:rounded-md" /> 
        </div>
        {/* Vertical */}
        <div className="zn:flex zn:items-center zn:gap-2">
          <Skeleton className="zn:h-10 zn:w-20 zn:rounded-md" />
          <Skeleton className="zn:h-4 zn:w-6" /> 
          <Skeleton className="zn:flex-1 zn:h-10 zn:rounded-md" /> 
        </div>
      </div>
    </div>
    )
   }
  return (
    <div className="zn:flex-1 zn:p-4 zn:border zn:border-gray-200 zn:rounded-md zn:bg-card">
      <div className="zn:flex zn:items-center zn:justify-between zn:mb-4">
        <div className="zn:flex zn:items-center zn:gap-2">
          <span className="zn:font-medium zn:text-gray-700">
            Enable exact button positioning
          </span>
          <Info className="zn:size-4 zn:text-gray-400" />
        </div>

        <button
          role="switch"
          aria-checked={svgSettings.exactPosition.enabled}
          onClick={()=> setSvgSettings((prev) => ({ ...prev, 
            exactPosition: {
              ...prev.exactPosition,
              enabled: !prev.exactPosition.enabled,
            },
          }))}
          className={cn(
            "zn:relative zn:inline-flex zn:h-6 zn:w-10 zn:cursor-pointer zn:rounded-full zn:border-2 zn:border-transparent zn:transition-colors focus:zn:outline-none focus:zn:ring-2 focus:zn:ring-blue-500 focus:zn:ring-offset-2",
            enabled ? "zn:bg-blue-600" : "zn:bg-gray-200"
          )}
        >
          <span className="zn:sr-only">Toggle exact button positioning</span>
          <span
            aria-hidden="true"
            className={cn(
              "zn:inline-block zn:size-5 zn:transform zn:rounded-full zn:bg-white zn:shadow zn:transition",
              enabled ? "zn:translate-x-4" : "zn:translate-x-0"
            )}
          />
        </button>
      </div>

      <div className="zn:space-y-3">
        {/* Horizontal */}
        <div className="zn:flex zn:items-center zn:gap-2">
          <input
            type="number"
            value={horizontalOffset}
            onChange={(e) => setSvgSettings((prev) => ({
              ...prev,
              exactPosition: {
                ...prev.exactPosition,
                horizontalOffset: e.target.value,
              },
            }))}
            disabled={!enabled}
            className={cn('zn:w-20 zn:p-2 zn:border zn:border-gray-300 zn:rounded-md zn:text-center focus:zn:ring-2 focus:zn:ring-blue-500', {
              "zn:cursor-not-allowed": !enabled,
            })}
          />
          <span className="zn:text-gray-500">px</span>
          <Select value={horizontalDirection}
          disabled={!enabled}
           onValueChange={
            (value) => setSvgSettings((prev) => ({
              ...prev,
              exactPosition: {
                ...prev.exactPosition,
                horizontalDirection: value,
              },
            }))
           }
           >
            <SelectTrigger className="zn:flex-1">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">To the left</SelectItem>
              <SelectItem value="right">To the right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vertical */}
        <div className="zn:flex zn:items-center zn:gap-2">
          <input
            type="number"
            value={verticalOffset}
            onChange={
              (e) => setSvgSettings((prev) => ({
                ...prev,
                exactPosition: {
                  ...prev.exactPosition,
                  verticalOffset: e.target.value,
                },
              }))
            }
            disabled={!enabled}
            className={cn('zn:w-20 zn:p-2 zn:border zn:border-gray-300 zn:rounded-md zn:text-center focus:zn:ring-2 focus:zn:ring-blue-500', {
              "zn:cursor-not-allowed": !enabled,
            })}
          />
          <span className="zn:text-gray-500">px</span>
          <Select value={verticalDirection} onValueChange={
            (value) => setSvgSettings((prev) => ({
              ...prev,
              exactPosition: {
                ...prev.exactPosition,
                verticalDirection: value,
              },
            }))
          }
           disabled={!enabled}>
            <SelectTrigger className="zn:flex-1">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="higher">Higher</SelectItem>
              <SelectItem value="lower">Lower</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}