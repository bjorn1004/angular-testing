import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from 'src/app/modules/shared/material/material.module';

const SHARED = [
	CommonModule,
	LayoutModule,

	// Material
	MaterialModule,
];

/**
 * Contains modules that are likely to be used across all who import
 */
@NgModule({
	declarations: [],
	imports: [...SHARED],
	exports: [...SHARED],
})
export class SharedModule {}
