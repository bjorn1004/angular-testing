import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperTileComponent } from './minesweeper-tile.component';

describe('MinesweeperTileComponent', () => {
  let component: MinesweeperTileComponent;
  let fixture: ComponentFixture<MinesweeperTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinesweeperTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinesweeperTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
