/**
 * User Dropdown Menu
 * Feature 011: Vendor Portal MVP
 * Phase 2: Secondary Navigation
 *
 * Dropdown menu for accessing Profile, Training, Settings, and Application Status.
 * Part of Option C (Hybrid Navigation) implementation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap, Settings, FileText, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface UserDropdownMenuProps {
  userName: string;
  userInitial: string;
  showApplicationStatus?: boolean;
}

/**
 * UserDropdownMenu
 *
 * Provides access to secondary vendor portal features:
 * - Profile management
 * - Training resources
 * - Settings
 * - Application status (conditionally for pending vendors)
 */
export function UserDropdownMenu({
  userName,
  userInitial,
  showApplicationStatus = false,
}: UserDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 px-3 py-1.5 border border-border rounded-md hover:bg-accent transition-colors">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: '#2E8B57' }}
          >
            {userInitial}
          </div>
          <span className="text-sm text-muted-foreground">{userName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">Vendor Portal</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/app/vendor/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/app/vendor/training" className="cursor-pointer">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Training</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/app/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        {showApplicationStatus && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/vendor/application/status" className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Application Status</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
