import { useState, useCallback } from "react";
import type { PropertyListing } from "../types";

export type PropertyPanelMode = "detail" | "grid" | null;

export interface PanelState {
  chatOpen: boolean;
  propertyPanelOpen: boolean;
  propertyPanelMode: PropertyPanelMode;
  selectedProperty: PropertyListing | null;
  allListings: PropertyListing[];
}

export interface PanelActions {
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  openPropertyDetail: (property: PropertyListing) => void;
  openPropertyGrid: (listings: PropertyListing[]) => void;
  closePropertyPanel: () => void;
  setAllListings: (listings: PropertyListing[]) => void;
}

/**
 * Custom hook for managing dual-panel state in the chatbot
 *
 * Handles:
 * - Chat panel open/close
 * - Property panel open/close (detail vs grid mode)
 * - Dependency: closing chat closes property panel
 * - Property selection and listings management
 */
export function usePanelState(): [PanelState, PanelActions] {
  const [chatOpen, setChatOpen] = useState(false);
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(false);
  const [propertyPanelMode, setPropertyPanelMode] =
    useState<PropertyPanelMode>(null);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyListing | null>(null);
  const [allListings, setAllListings] = useState<PropertyListing[]>([]);

  const openChat = useCallback(() => {
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
    // Dependency: closing chat also closes property panel
    setPropertyPanelOpen(false);
    setPropertyPanelMode(null);
    setSelectedProperty(null);
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen((prev) => {
      const newState = !prev;
      // If closing chat, also close property panel
      if (!newState) {
        setPropertyPanelOpen(false);
        setPropertyPanelMode(null);
        setSelectedProperty(null);
      }
      return newState;
    });
  }, []);

  const openPropertyDetail = useCallback((property: PropertyListing) => {
    setSelectedProperty(property);
    setPropertyPanelMode("detail");
    setPropertyPanelOpen(true);
  }, []);

  const openPropertyGrid = useCallback((listings: PropertyListing[]) => {
    setAllListings(listings);
    setPropertyPanelMode("grid");
    setPropertyPanelOpen(true);
    setSelectedProperty(null);
  }, []);

  const closePropertyPanel = useCallback(() => {
    setPropertyPanelOpen(false);
    setPropertyPanelMode(null);
    setSelectedProperty(null);
  }, []);

  const state: PanelState = {
    chatOpen,
    propertyPanelOpen,
    propertyPanelMode,
    selectedProperty,
    allListings,
  };

  const actions: PanelActions = {
    openChat,
    closeChat,
    toggleChat,
    openPropertyDetail,
    openPropertyGrid,
    closePropertyPanel,
    setAllListings,
  };

  return [state, actions];
}
