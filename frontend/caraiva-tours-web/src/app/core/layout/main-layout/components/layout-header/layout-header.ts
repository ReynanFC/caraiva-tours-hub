import { Component, computed, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { SidebarModule } from 'primeng/sidebar';
import {
  UserProfile,
  getUserDisplayName,
  getUserInitials,
  getUserRoleLabel,
} from '../../../user-profile';

@Component({
  selector: 'app-layout-header',
  imports: [SidebarModule, PIcon],
  templateUrl: './layout-header.html',
  styleUrl: './layout-header.css',
})
export class LayoutHeader {
  readonly profile = input<UserProfile | null>(null);
  readonly title = input.required<string>();
  readonly description = input.required<string>();

  protected readonly displayName = computed(() => getUserDisplayName(this.profile()));
  protected readonly roleLabel = computed(() => getUserRoleLabel(this.profile()));
  protected readonly initials = computed(() => getUserInitials(this.profile()));
}
