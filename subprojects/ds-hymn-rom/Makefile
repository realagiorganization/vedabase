SHELL := /bin/bash

export BLOCKSDS ?= /opt/blocksds/core
export BLOCKSDSEXT ?= /opt/blocksds/external
export WONDERFUL_TOOLCHAIN ?= /opt/wonderful

ARM_NONE_EABI_PATH ?= $(WONDERFUL_TOOLCHAIN)/toolchain/gcc-arm-none-eabi/bin/
DOCKER_IMAGE ?= skylyrac/blocksds:slim-latest
NPM ?= npm
EMULATOR_BIN ?=
MEDIA_DIR ?= artifacts/emulator-media

NAME := vedabase_hymn_favorites
GAME_TITLE := Vedabase Hymns
GAME_SUBTITLE := Generated Favorites
GAME_AUTHOR := realagiorganization/vedabase

SOURCEDIRS := source
INCLUDEDIRS := source
LIBS := -lnds9
LIBDIRS := $(BLOCKSDS)/libs/libnds
ARM7ELF := $(BLOCKSDS)/sys/default_arm7/arm7.elf

BUILDDIR := build/$(NAME)
ELF := build/$(NAME).elf
MAP := build/$(NAME).map
DUMP := build/$(NAME).dump
ROM := $(NAME).nds

PREFIX := $(ARM_NONE_EABI_PATH)arm-none-eabi-
CC := $(PREFIX)gcc
LD := $(PREFIX)gcc
OBJDUMP := $(PREFIX)objdump
MKDIR := mkdir -p
RM := rm -rf

ARCH := -mthumb -mcpu=arm946e-s+nofp
SPECS := $(BLOCKSDS)/sys/crts/ds_arm9.specs
WARNFLAGS := -Wall -Wextra -Werror

SOURCES_C := $(shell find -L $(SOURCEDIRS) -name "*.c")
OBJS := $(addsuffix .o,$(addprefix $(BUILDDIR)/,$(SOURCES_C)))
DEPS := $(OBJS:.o=.d)

INCLUDEFLAGS := $(foreach path,$(INCLUDEDIRS),-I$(path)) \
	$(foreach path,$(LIBDIRS),-I$(path)/include)
LIBDIRSFLAGS := $(foreach path,$(LIBDIRS),-L$(path)/lib)

CFLAGS += $(WARNFLAGS) $(INCLUDEFLAGS) $(ARCH) -O2 -ffunction-sections -fdata-sections \
	-specs=$(SPECS)
LDFLAGS += $(ARCH) $(LIBDIRSFLAGS) -Wl,-Map,$(MAP) \
	-Wl,--start-group $(LIBS) -lc -Wl,--end-group -specs=$(SPECS)

.PHONY: all install generate lint test test-ci verify nds-build docker-build-rom emulator-smoke clean dump

all: verify nds-build

install:
	$(NPM) ci

generate:
	$(NPM) run generate

lint:
	$(NPM) run lint

test:
	$(NPM) run test

test-ci:
	$(NPM) run test:ci

verify:
	$(NPM) run verify

nds-build: $(ROM)

docker-build-rom: generate
	docker run --rm -v "$(CURDIR)":/work -w /work $(DOCKER_IMAGE) make nds-build

emulator-smoke: nds-build
	test -n "$(EMULATOR_BIN)"
	EMULATOR_BIN="$(EMULATOR_BIN)" ROM_PATH="$(CURDIR)/$(ROM)" OUT_DIR="$(CURDIR)/$(MEDIA_DIR)" \
		bash scripts/emulator-smoke.sh

$(ROM): $(ELF)
	@echo "  NDSTOOL $@"
	$(BLOCKSDS)/tools/ndstool/ndstool -c $@ -7 $(ARM7ELF) -9 $(ELF)

$(ELF): $(OBJS)
	@echo "  LD      $@"
	@$(MKDIR) $(@D)
	$(LD) -o $@ $(OBJS) $(LDFLAGS)

$(DUMP): $(ELF)
	@echo "  OBJDUMP $@"
	$(OBJDUMP) -h -C -S $< > $@

dump: $(DUMP)

$(BUILDDIR)/%.c.o: %.c
	@echo "  CC      $<"
	@$(MKDIR) $(@D)
	$(CC) $(CFLAGS) -MMD -MP -c -o $@ $<

clean:
	$(RM) build $(ROM)

-include $(DEPS)
