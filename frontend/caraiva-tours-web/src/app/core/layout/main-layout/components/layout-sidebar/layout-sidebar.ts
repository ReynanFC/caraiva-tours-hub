import { Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { SidebarModule } from 'primeng/sidebar';
import { NavigationItem } from '../../../models/navigation-item';
import {
  UserProfile,
  getUserDisplayName,
  getUserInitials,
  getUserRoleLabel,
} from '../../../models/user-profile';

@Component({
  selector: 'app-layout-sidebar',
  imports: [SidebarModule, PIcon, RouterLink, RouterLinkActive],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.css',
})
export class LayoutSidebar {
  readonly profile = input<UserProfile | null>(null);
  readonly navigationItems = input.required<readonly NavigationItem[]>();
  readonly isMobile = input(false);
  readonly open = input(true);

  readonly openChange = output<boolean>();
  readonly signOut = output<void>();
  readonly profileRequested = output<void>();

  protected readonly displayName = computed(() => getUserDisplayName(this.profile()));
  protected readonly roleLabel = computed(() => getUserRoleLabel(this.profile()));
  protected readonly initials = computed(() => getUserInitials(this.profile()));

  protected closeOnMobile(): void {
    if (this.isMobile()) this.openChange.emit(false);
  }
}
